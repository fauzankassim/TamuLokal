const controllers = require('../controllers/products')
const router = require('express').Router()


router.post('/:id/review', controllers.PostProductReview)
router.put('/:id/review', controllers.PutProductReview)

router.get('/qtype', controllers.GetProductQuantityType)
router.delete('/:id', controllers.DeleteProductById)
router.get('/:id', controllers.GetProductById)
router.put('/:id', controllers.PutProductById)
router.put('/:id/image', controllers.PutProductImageById)

router.get('/', controllers.GetProductsByVendorID)

router.post('/', controllers.PostProduct)


module.exports = router;
