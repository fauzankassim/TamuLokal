const controllers = require('../controllers/marketownerships')
const router = require('express').Router()

router.get('/', controllers.GetMarketOwnershipByOrganizerId)

module.exports = router;