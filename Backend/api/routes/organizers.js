const controllers = require('../controllers/organizers')
const router = require('express').Router()

router.get('/', controllers.GetOrganizers)
router.post('/', controllers.PostOrganizer)
router.get('/:id', controllers.GetOrganizerProfileById)
router.put('/:id', controllers.PutOrganizerProfileById)
router.get('/:id/market', controllers.GetOrganizerMarketById)

module.exports = router;