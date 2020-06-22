const puppeteer = require('puppeteer')
const fs = require('fs')

const uri = 'https://news.google.com/covid19/map?hl=pt-BR&gl=BR&ceid=BR:pt-419'

module.exports = async () => {
    console.log('Updating data...')

    const browser = await puppeteer.launch({
        args: ['--no-sandbox']
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
        await page.goto(uri, {
            waitUntil: 'load',
            timeout: 0
        })
        await page.hover('div[jsaction="pSI0Dc:mMUZad;rcuQ6b:npT2md;c0v8t:gmfnwb; mouseover:gmfnwb; touchstart:gmfnwb;"]')

        const countries = await page.$$eval('table[class="pH8O4c"] tbody tr', (rows) => {
            return rows.map((row) => {
                const tds = row.querySelectorAll('td')
                const spans = row.querySelectorAll('th div div')
                const countryName = spans[spans.length - 1].textContent.replace('—', 'Não há dados')
                return {
                    dataId: row.getAttribute('data-id'),
                    country: countryName,
                    confirmed: tds[0].textContent.replace('—', 'Não há dados'),
                    recovered: tds[2].textContent.replace('—', 'Não há dados'),
                    death: tds[3].textContent.replace('—', 'Não há dados')
                }
            })
        })

        for (let country of countries) {
            if (country.country !== 'Global') {
                const dataId = country.dataId
                const uri = `https://news.google.com/covid19/map?hl=pt-BR&gl=BR&ceid=BR%3Apt-419&mid=${dataId}`
                
                await page.goto(uri, {
                    waitUntil: 'load',
                    timeout: 0
                })
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
                            death: tds[3].textContent.replace('—', 'Não há dados')
                        }
                    }).filter(state => state.state !== 'Global' && country.country !== state.state) // Removes "Global" data and country as state
                }, country)
            }
            delete country.dataId
        }
        fs.writeFileSync(`${__dirname}/coronavirus-data.json`, JSON.stringify(countries, null, 4))
        console.log('The data has been updated.')
    } catch(err) {
        console.log('An erros has occurred.', new Error(err).message)
    } finally {
        await browser.close()
    }
}