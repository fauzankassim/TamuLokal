const controllers = require('../controllers/markets')
const router = require('express').Router()

router.get('/', controllers.GetMarkets)
router.get('/admin', controllers.GetMarketAdmin)
router.post('/', controllers.PostMarket)

router.post('/:id/click', controllers.PostMarketClick)

router.get('/:id', controllers.GetMarketById)
router.put('/:id', controllers.PutMarket)
router.delete('/:id', controllers.DeleteMarket)

router.get('/:id/verify', controllers.GetVerification)
router.put('/:id/verify', controllers.PutVerification)
router.put('/:id/image', controllers.PutMarketImage)

router.post('/:id/space', controllers.PostMarketspace)
router.delete('/:id/space', controllers.DeleteMarketspace)
router.get('/:id/space', controllers.GetMarketspace)
router.put('/:id/space', controllers.PutMarketspace)

router.post('/:id/visit', controllers.PostMarketVisitor)

router.get('/:id/statistic', controllers.GetMarketStatistic)
router.get('/:id/statistic-download', controllers.DownloadMarketStatistic)
router.get('/:id/vendor', controllers.GetMarketVendors)
router.get('/:id/review', controllers.GetMarketReview)
router.post('/:id/review', controllers.PostMarketReview)
router.put('/:id/review', controllers.PutMarketReview)
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
