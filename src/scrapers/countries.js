const browser = require('./browser')

const uri = 'https://news.google.com/covid19/map?hl=pt-BR&gl=BR&ceid=BR:pt-419'

exports.countries = async () => {
    const page = await browser()

    await page.goto(uri)
    await page.hover('div[jsaction="pSI0Dc:mMUZad;rcuQ6b:npT2md;c0v8t:gmfnwb; mouseover:gmfnwb; touchstart:gmfnwb;"]')

    const results = await page.$$eval('table[class="pH8O4c"] tbody tr', (rows) => {
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
    })

    await page.close()
    return results
}

exports.country = async (search) => {
    const page = await browser()

    await page.goto(uri)
    await page.hover('div[jsaction="pSI0Dc:mMUZad;rcuQ6b:npT2md;c0v8t:gmfnwb; mouseover:gmfnwb; touchstart:gmfnwb;"]')

    const result = await page.$$eval('table[class="pH8O4c"] tbody tr', (rows, search) => rows.filter((row) => {
        const spans = row.querySelectorAll('th div span')
        const countryName = spans[spans.length - 1].textContent
        return countryName.toLowerCase() === search.toLowerCase()
    }).map((row) => {
        const tds = row.querySelectorAll('td')
        const spans = row.querySelectorAll('th div span')
        return {
            country: spans[spans.length - 1].textContent,
            confirmed: tds[0].textContent,
            recovered: tds[2].textContent,
            death: tds[3].textContent
        }
    }), search)

    await page.close()
    return result
}