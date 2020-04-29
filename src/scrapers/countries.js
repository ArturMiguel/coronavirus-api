const browser = require('./browser')

const uri = 'https://news.google.com/covid19/map?hl=pt-BR&gl=BR&ceid=BR:pt-419'

module.exports = async () => {
    const page = await browser()

    await page.goto(uri)
    await page.hover('div[jsaction="pSI0Dc:mMUZad;rcuQ6b:npT2md;c0v8t:gmfnwb; mouseover:gmfnwb; touchstart:gmfnwb;"]')

    const results = await page.$$eval('table tbody tr', (rows) => {
        return rows.map((row) => {
            const tds = row.querySelectorAll('td')
            return {
                country: row.querySelector('th div span').textContent,
                confirmed: tds[0].textContent,
                recovered: tds[2].textContent,
                death: tds[3].textContent
            }
        })
    })

    await page.close()
    return results
}