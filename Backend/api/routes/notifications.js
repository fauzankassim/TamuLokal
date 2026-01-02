const controllers = require('../controllers/notifications')
const router = require('express').Router()

router.get('/', controllers.GetNotification)
router.put('/:id', controllers.PutNotificationIsRead)

module.exports = router;