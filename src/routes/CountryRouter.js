const router = require('express').Router()
const CountryController = require('../controllers/CountryController')

router.get('/api/v1/countries', CountryController.getCountries)
router.get('/api/v1/countries/:country', CountryController.getCountry)

module.exports = router