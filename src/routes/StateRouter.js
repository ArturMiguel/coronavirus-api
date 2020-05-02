const router = require('express').Router()
const StateController = require('../controllers/StateController')

router.get('/api/states/:state', StateController.getState)

module.exports = router