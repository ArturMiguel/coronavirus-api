const puppeteer = require('puppeteer')
const fs = require('fs')

const uri = 'https://news.google.com/covid19/map?hl=pt-BR&gl=BR&ceid=BR:pt-419'

module.exports = async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.setRequestInterception(true)
    const blockedResources = ['stylesheet', 'image', 'media', 'font', 'texttrack', 'xhr', 'fetch', 'eventsource', 'websocket', 'manifest', 'other']
    page.on('request', (req) => {
        if (blockedResources.indexOf(req.resourceType()) !== -1) req.abort()
        else req.continue()
    })

    await page.goto(uri)
    await page.hover('div[jsaction="pSI0Dc:mMUZad;rcuQ6b:npT2md;c0v8t:gmfnwb; mouseover:gmfnwb; touchstart:gmfnwb;"]')

    await page.$$eval('table[class="pH8O4c"] tbody tr', (rows) => {
        return rows.map((row) => {
            const tds = row.querySelectorAll('td')
            const spans = row.querySelectorAll('th div span')
            return {
                country: spans[spans.length - 1].textContent,
                confirmed: tds[0].textContent,
                recovered: tds[2].textContent,
                death: tds[3].textContent
            }
        })
    }).then((results) => {
        fs.writeFileSync(`${__dirname}/coronavirus-data.json`, JSON.stringify(results))
    }).catch((err) => {
        console.log('Erro ao recuperar os últimos dados!\n', new Error(err).message)
    })

    await browser.close()
}