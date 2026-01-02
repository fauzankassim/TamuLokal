const controllers = require('../controllers/statics')
const router = require('express').Router()


router.get('/frequency', controllers.GetFrequencyType)

module.exports = router;