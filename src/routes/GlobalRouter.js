const router = require('express').Router()
const GlobalController = require('../controllers/GlobalController')

router.get('/api/v1/global', GlobalController.getGlobal)

module.exports = router