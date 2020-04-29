const router = require('express').Router()
const CountryController = require('../controllers/CountryController')

router.get('/api/countries', CountryController.getCountries)

module.exports = router