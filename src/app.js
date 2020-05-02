const express = require('express')
const cors = require('cors')

class AppController {
    constructor() {
        this.express = express()
        this.middlewares()
        this.routes()
    }

    middlewares() {
        this.express.use(cors())
    }

    routes() {
        this.express.use(require('./routes/CountryRouter'))
        this.express.use(require('./routes/StateRouter'))
    }
}

module.exports = new AppController().express