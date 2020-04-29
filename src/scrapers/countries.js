const puppeteer = require('puppeteer')

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

    const results = await page.evaluate(() => {
        const trs = Array.from(document.querySelectorAll('table tbody tr'))
        trs.shift()
        
        const data = trs.map((row, i) => {
            const tds = row.querySelectorAll('td')
            return {
                country: row.querySelector('th div span').textContent,
                confirmed: tds[0].textContent,
                recovered: tds[2].textContent,
                death: tds[3].textContent
            }
        })
        return data
    })

    await browser.close()
    return results
}