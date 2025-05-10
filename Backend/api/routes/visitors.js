const controllers = require('../controllers/visitors')
const router = require('express').Router()


router.get('/', controllers.getVisitors)

module.exports = router;
