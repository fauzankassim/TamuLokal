const controllers = require('../controllers/markets')
const router = require('express').Router()

router.get('/', controllers.getMarkets)
router.get('/:id', controllers.getMarketById)

module.exports = router;
