const controllers = require('../controllers/visitors')
const router = require('express').Router()

router.get('/', controllers.getVisitors)
router.get('/:id', controllers.getVisitorById)

module.exports = router;
