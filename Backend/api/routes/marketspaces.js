const controllers = require('../controllers/marketspaces')
const router = require('express').Router()

router.get('/available', controllers.GetAvailableMarketspace)
router.post('/:id/apply', controllers.PostMarketspaceApplication)

router.get('/:id', controllers.GetMarketspaceById)
router.get('/:id/product', controllers.GetMarketspaceProduct)
router.post('/:id/product', controllers.PostMarketspaceProduct)
router.delete('/:id/product', controllers.DeleteMarketspaceProduct)

router.get('/', controllers.GetMarketspaceByAccountId)
router.put('/:id/state', controllers.PutMarketspaceState)

module.exports = router;