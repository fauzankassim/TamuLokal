const controllers = require('../controllers/visitors')
const router = require('express').Router()


router.get('/', controllers.allVisitors)

module.exports = router;
