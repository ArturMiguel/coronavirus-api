const coronavirusData = require('../scrapers/coronavirus-data.json') 

class CountryController {
    getCountries(req, res) {
        res.send(coronavirusData)
    }

    getCountry(req, res) {
        const search = req.params.country
        if (!search) return req.status(400).send({ message: 'País não informado!' })

        String.prototype.normalizeStr = function() {
            return this.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        }

        const country = coronavirusData.filter(data => data.country.normalizeStr() === search.normalizeStr())
        if (country.length === 0) return res.status(400).send({ message: 'País não encontrado!' })

        return res.send(country)
    }
}

module.exports = new CountryController()