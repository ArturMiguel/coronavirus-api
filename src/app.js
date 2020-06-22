const express = require('express')
const cors = require('cors')
const scraper = require('./scrapers/countries')

class AppController {
    constructor() {
        this.express = express()
        this.middlewares()
        this.routes()
        this.update()
    }

    middlewares() {
        this.express.use(cors())
        this.express.set('x-powered-by', false)
    }

    routes() {
        this.express.use(require('./routes/GlobalRouter'))
        this.express.use(require('./routes/CountryRouter'))
        this.express.use(require('./routes/StateRouter'))
        this.express.use(require('./routes/DocumentationRouter'))
    }

    async update() {
        console.log('Updating data...')
        await scraper()
        setInterval(async () => {
            console.log('Updating data...')
            await scraper()
        }, 1000 * 60 * 60 * 4)
    }
}

module.exports = new AppController().express