const router = require('express').Router()
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../public/api-documentation/swagger.json')

router.use('/api/docs', swaggerUi.serve)
router.get('/api/docs', swaggerUi.setup(swaggerDocument, {
    customSiteTitle: 'coronavirus-api',
    customfavIcon: '.'
}))

module.exports = router
