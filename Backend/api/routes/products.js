const controllers = require('../controllers/products')
const router = require('express').Router()



router.get('/qtype', controllers.GetProductQuantityType)
router.delete('/:id', controllers.DeleteProductById)
router.get('/:id', controllers.GetProductById)
router.put('/:id', controllers.PutProductById)

router.get('/', controllers.GetProductsByVendorID)

router.post('/', controllers.PostProduct)


module.exports = router;
