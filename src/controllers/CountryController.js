const countriesScraper = require('../scrapers/countries')

class CountryController {
    async getCountries(req, res) {
        const countries = await countriesScraper.countries()
        res.send(countries)
    }

    async getCountry(req, res) {
        const search = req.params.country
        if (!search) return req.status(400).send({ message: 'País não informado!' })

        const country = await countriesScraper.country(search)
        if (country.length <= 0) return res.status(404).send({ message: 'País não encontrado!' })

        return res.send(country)
    }
}

module.exports = new CountryController() 