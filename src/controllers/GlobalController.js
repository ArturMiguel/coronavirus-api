const coronavirusData = require('../scrapers/coronavirus-data.json')

class GlobalController {
    getGlobal(req, res) {
        const global = coronavirusData.filter(data => data.country === 'Global')
        return res.send(global)
    }
}

module.exports = new GlobalController()