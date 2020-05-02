const puppeteer = require('puppeteer')
const fs = require('fs')

const uri = 'https://news.google.com/covid19/map?hl=pt-BR&gl=BR&ceid=BR:pt-419'

module.exports = async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    // Blocks some resources to optimize page loading
    await page.setRequestInterception(true)
    const blockedResources = ['stylesheet', 'image', 'media', 'font', 'texttrack', 'xhr', 'fetch', 'eventsource', 'websocket', 'manifest', 'other']

    page.on('request', (req) => {
        if (blockedResources.indexOf(req.resourceType()) !== -1) req.abort()
        else req.continue()
    })

    try {
        await page.goto(uri)
        await page.hover('div[jsaction="pSI0Dc:mMUZad;rcuQ6b:npT2md;c0v8t:gmfnwb; mouseover:gmfnwb; touchstart:gmfnwb;"]')

        const countries = await page.$$eval('table[class="pH8O4c"] tbody tr', (rows) => {
            return rows.map((row) => {
                const tds = row.querySelectorAll('td')
                const spans = row.querySelectorAll('th div span')
                const countryName = spans[spans.length - 1].textContent
                return {
                    country: countryName,
                    confirmed: tds[0].textContent,
                    recovered: tds[2].textContent,
                    death: tds[3].textContent,
                }
            }).filter(country => country.country !== 'Global') // Removes "Global" data
        })

        for (let country of countries) {
            const uriPart = await page.$eval(`div[class="GycLre"] div[aria-label="${country.country}"]`, d => d.getAttribute('data-value'))
            let stateUri = ''
           
            if (uriPart.includes('/g/')) { // e.g. /g/121p5z1h
                stateUri = `https://news.google.com/covid19/map?hl=pt-BR&gl=BR&ceid=BR%3Apt-419&mid=%2Fg%2F${uriPart}`.replace('/g/', '')
            } else if (uriPart.includes('/m/')) { // e.g. /m/015fr
                stateUri = `https://news.google.com/covid19/map?hl=pt-BR&gl=BR&ceid=BR%3Apt-419&mid=%2Fm%2F${uriPart}`.replace('/m/', '')
            }

            await page.goto(stateUri)

            const tableHover = await page.$('div[jsaction="pSI0Dc:mMUZad;rcuQ6b:npT2md;c0v8t:gmfnwb; mouseover:gmfnwb; touchstart:gmfnwb;"]')
            if (tableHover !== null) await tableHover.hover()

            country.states = await page.$$eval('table[class="pH8O4c"] tbody tr', (rows, country) => {
                return rows.map((row) => {
                    const tds = row.querySelectorAll('td')
                    const spans = row.querySelectorAll('th div span')
                    const stateName = spans[spans.length - 1].textContent
                    return {
                        state: stateName,
                        confirmed: tds[0].textContent,
                        recovered: tds[2].textContent,
                        death: tds[3].textContent,
                    }
                }).filter(state => state.state !== 'Global' && country.country !== state.state) // Removes "Global" data and country as state
            }, country)
        }

        fs.writeFileSync(`${__dirname}/coronavirus-data.json`, JSON.stringify(countries, null, 4))
    } catch(err) {
        console.log('Erro ao recuperar os últimos dados!\n', new Error(err).message)
    } finally {
        await browser.close()
    }
}