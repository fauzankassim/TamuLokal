const controllers = require('../controllers/vendors')
const router = require('express').Router()

router.get('/:id/marketspace/application', controllers.GetMarketspaceApplication)
router.get('/:id/all', controllers.GetVendorById)
router.get('/:id/statistic', controllers.GetStatistic)
router.get('/', controllers.GetVendors)
router.post('/', controllers.PostVendor)
router.get('/:id', controllers.GetVendorProfileById)
router.put('/:id', controllers.PutVendorProfileById)
router.put('/:id/image', controllers.PutVendorImageById)
router.delete('/:id', controllers.DeleteVendorById)

module.exports = router;
