const puppeteer = require('puppeteer')
const fs = require('fs')

const uri = 'https://news.google.com/covid19/map?hl=pt-BR&gl=BR&ceid=BR:pt-419'

module.exports = async () => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'] // glitch.com fix
    })
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
                const spans = row.querySelectorAll('th div div')
                const countryName = spans[spans.length - 1].textContent.replace('—', 'Não há dados')
                return {
                    country: countryName,
                    confirmed: tds[0].textContent.replace('—', 'Não há dados'),
                    recovered: tds[2].textContent.replace('—', 'Não há dados'),
                    death: tds[3].textContent.replace('—', 'Não há dados'),
                }
            })
        })

        for (let country of countries) {
            if (country.country !== 'Global') {
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
                        const spans = row.querySelectorAll('th div div')
                        const stateName = spans[spans.length - 1].textContent.replace('—', 'Não há dados')
                        return {
                            state: stateName,
                            confirmed: tds[0].textContent.replace('—', 'Não há dados'),
                            recovered: tds[2].textContent.replace('—', 'Não há dados'),
                            death: tds[3].textContent.replace('—', 'Não há dados'),
                        }
                    }).filter(state => state.state !== 'Global' && country.country !== state.state) // Removes "Global" data and country as state
                }, country)
            }
        }

        fs.writeFileSync(`${__dirname}/coronavirus-data.json`, JSON.stringify(countries, null, 4))
    } catch(err) {
        console.log('Erro ao recuperar os últimos dados!\n', new Error(err).message)
    } finally {
        await browser.close()
    }
}