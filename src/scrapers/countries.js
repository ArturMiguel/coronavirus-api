const axios = require('axios')
const cheerio = require('cheerio')

const uri = 'https://en.wikipedia.org/wiki/Template:2019%E2%80%9320_coronavirus_pandemic_data#covid19-container'

module.exports = async () => {
    const res = await axios.get(uri)
    const data = res.data
    const $ = cheerio.load(data)

    const table = $('#thetable')
    const rows = $('tbody tr', table).toArray().filter(row => $(row).attr('class') !== 'sortbottom')
    rows.splice(0, 2)
    
    const results = []

    for (let row of rows ) {
        const ths = $('th', row)
        const tds = $('td', row)

        results.push({
            icon: `https:${$('img', ths[0]).attr('src')}`,
            country: $('a', ths[1]).text().replace(/\[.*]/, ''),
            confirmed:  $(tds[0]).text().replace(/\n/, ''),
            death: $(tds[1]).text().replace(/\n/, ''),
            recovered: $(tds[2]).text().replace(/\n/, ''),
        })
    }

    return results
}