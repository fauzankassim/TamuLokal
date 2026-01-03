const controllers = require('../controllers/markets')
const router = require('express').Router()

router.get('/', controllers.GetMarkets)
router.post('/', controllers.PostMarket)

router.get('/:id', controllers.GetMarketById)
router.put('/:id', controllers.PutMarket)

router.get('/:id/space', controllers.GetMarketspace)
router.post('/:id/visit', controllers.PostMarketVisitor)

router.get('/:id/statistic', controllers.GetMarketStatistic)
router.get('/:id/vendor', controllers.GetMarketVendors)
router.get('/:id/review', controllers.GetMarketReview)
router.post('/:id/review', controllers.PostMarketReview)
router.get('/:id/rating', controllers.GetMarketRatings)

router.post('/:id/schedule', controllers.PostMarketSchedule)
router.get('/:id/schedule', controllers.GetMarketSchedule)
router.delete('/:id/schedule', controllers.DeleteMarketSchedule)



router.get('/:id/like', controllers.GetMarketLikeById)
router.post('/:id/like', controllers.PostMarketLikeById)
router.delete('/:id/like', controllers.DeleteMarketLikeById)

router.get('/:id/bookmark', controllers.GetMarketBookmarkById)
router.post('/:id/bookmark', controllers.PostMarketBookmarkById)
router.delete('/:id/bookmark', controllers.DeleteMarketBookmarkById)



module.exports = router;
