const puppeteer = require('puppeteer')

module.exports = async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.setRequestInterception(true)
    const blockedResources = ['stylesheet', 'image', 'media', 'font', 'texttrack', 'xhr', 'fetch', 'eventsource', 'websocket', 'manifest', 'other']
    page.on('request', (req) => {
        if (blockedResources.indexOf(req.resourceType()) !== -1) req.abort()
        else req.continue()
    })

    return page
}