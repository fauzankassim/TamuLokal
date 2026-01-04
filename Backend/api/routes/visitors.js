const controllers = require('../controllers/visitors')
const router = require('express').Router()

router.get('/:id/post', controllers.GetContent)
router.put('/:id/market-review', controllers.PutMarketReview)
router.get('/:id/market-review', controllers.GetMarketReview)
router.get('/:id/market-bookmark', controllers.GetMarketBookmark)
router.get('/:id/market-history', controllers.GetMarketHistory)
router.get('/', controllers.GetVisitors)
router.post('/', controllers.PostVisitor)
router.get('/:id', controllers.GetVisitorProfileById)

router.put('/:id', controllers.PutVisitorById)
router.delete('/:id', controllers.DeleteVisitorById)
router.put('/:id/image', controllers.PutVisitorImageById)
router.get('/:id/market', controllers.GetVisitorVisitedMarket)


module.exports = router;
