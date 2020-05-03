const coronavirusData = require('../scrapers/coronavirus-data.json')

class StateController {
    getState(req, res) {
        let search = req.params.state
        if (!search) return req.status(400).send({ message: 'Estado não informado!' })

        String.prototype.normalizeStr = function() {
            return this.toLocaleLowerCase().normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/ı/g, 'i')
            .replace(/ł/g, 'l')
        }

        const country = coronavirusData
        .filter(data => data.country !== 'Global' && data.states.find(state => state.state.normalizeStr() === search.normalizeStr()))
        if (country.length === 0) return res.status(400).send({ message: 'Estado não encontrado!' })

        const state = country[0].states.filter(state => state.state.normalizeStr() === search.normalizeStr())
        return res.send(state)
    }
}

module.exports = new StateController()