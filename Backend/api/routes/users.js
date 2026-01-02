const controllers = require('../controllers/users')
const router = require('express').Router()

router.delete('/follow', controllers.DeleteUserFollow)
router.get('/follow', controllers.GetUserFollow)
router.post('/follow', controllers.PostUserFollow)
router.get('/', controllers.GetUserByQuery)
router.get('/:id/roles', controllers.GetUserRolesById)


module.exports = router;