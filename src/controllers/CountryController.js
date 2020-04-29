const countriesScraper = require('../scrapers/countries')

class CountryController {
    async getCountries(req, res) {
        const countries = await countriesScraper()
        res.send(countries)
    }
}

module.exports = new CountryController() 