const controllers = require('../controllers/vendors')
const router = require('express').Router()

router.get('/:id/marketspace/application', controllers.GetMarketspaceApplication)
router.delete('/:id/marketspace/application', controllers.DeleteMarketspaceApplication)
router.get('/:id/all', controllers.GetVendorById)
router.get('/:id/verify', controllers.GetVerification)
router.put('/:id/verify', controllers.PutVerification)
router.get('/:id/statistic', controllers.GetStatistic)
router.get('/:id/statistic-download', controllers.DownloadStatistic)
router.get('/', controllers.GetVendors)
router.post('/', controllers.PostVendor)
router.get('/:id', controllers.GetVendorProfileById)
router.put('/:id', controllers.PutVendorProfileById)
router.put('/:id/image', controllers.PutVendorImageById)
router.delete('/:id', controllers.DeleteVendor)

module.exports = router;
