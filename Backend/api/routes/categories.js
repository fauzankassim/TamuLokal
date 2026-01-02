const controllers = require('../controllers/categories')
const router = require('express').Router()


router.get('/:id', controllers.GetVendorsByCategoryId)

module.exports = router;