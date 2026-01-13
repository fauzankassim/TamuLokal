const controllers = require('../controllers/organizers')
const router = require('express').Router()


router.get('/', controllers.GetOrganizers)
router.post('/', controllers.PostOrganizer)

router.get('/:id', controllers.GetOrganizerProfileById)
router.put('/:id', controllers.PutOrganizerProfileById)
router.delete('/:id', controllers.DeleteOrganizer)
router.put('/:id/image', controllers.PutOrganizerImageById)

router.get('/:id/verify', controllers.GetVerification)
router.put('/:id/verify', controllers.PutVerification)


router.get('/:id/market', controllers.GetOrganizerMarketById)

module.exports = router;