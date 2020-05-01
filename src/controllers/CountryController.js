const coronavirusData = require('../scrapers/coronavirus-data.json') 

class CountryController {
    getCountries(req, res) {
        res.send(coronavirusData)
    }

    getCountry(req, res) {
        const search = req.params.country
        if (!search) return req.status(400).send({ message: 'País não informado!' })

        const country = coronavirusData.filter(data => data.country.toLowerCase() === search.toLowerCase())
        if (country.length <= 0) return res.status(400).send({ message: 'País não encontrado!' })

        return res.send(country)
    }
}

module.exports = new CountryController()