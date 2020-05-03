const router = require('express').Router()
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../public/api-documentation/swagger.json')

router.use('/api/v1/docs', swaggerUi.serve)
router.get('/api/v1/docs', swaggerUi.setup(swaggerDocument, {
    customSiteTitle: 'coronavirus-api',
    customfavIcon: '.'
}))

module.exports = router
