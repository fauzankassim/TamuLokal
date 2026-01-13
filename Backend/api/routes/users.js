const controllers = require('../controllers/users')
const router = require('express').Router()

router.get('/', controllers.GetUserByQuery)
router.post('/:id/click', controllers.PostUserClick)
router.get('/:id/profile', controllers.GetProfile)

router.delete('/follow', controllers.DeleteUserFollow)
router.get('/follow', controllers.GetUserFollow)
router.post('/follow', controllers.PostUserFollow)

router.get('/:id/roles', controllers.GetUserRolesById)


module.exports = router;