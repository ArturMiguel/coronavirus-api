const countriesScraper = require('../scrapers/countries')

class CountryController {
    async getCountries(req, res) {
        const countries = await countriesScraper()
        res.send(countries)
    }

    async getCountry(req, res) {
        const search = req.params.country
        if (!search) return req.status(400).send({ message: 'País não informado!' })

        const countries = await countriesScraper()
        const f = countries.find(c => c.country.toLocaleLowerCase() === search.toLocaleLowerCase())

        if (!f) return res.status(404).send({ message: 'País não encontrado!' })

        return res.send(f)
    }
}

module.exports = new CountryController() 