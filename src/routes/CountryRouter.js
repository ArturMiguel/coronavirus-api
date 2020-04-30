const router = require('express').Router()
const CountryController = require('../controllers/CountryController')

router.get('/api/countries', CountryController.getCountries)
router.get('/api/countries/:country', CountryController.getCountry)

module.exports = router