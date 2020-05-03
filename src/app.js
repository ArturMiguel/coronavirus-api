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
        this.express.set('x-powered-by', false)
    }

    routes() {
        this.express.use(require('./routes/GlobalRouter'))
        this.express.use(require('./routes/CountryRouter'))
        this.express.use(require('./routes/StateRouter'))
        this.express.use(require('./routes/DocumentationRouter'))
    }
}

module.exports = new AppController().express