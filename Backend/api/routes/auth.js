const controllers = require('../controllers/auth')
const router = require('express').Router()

router.get('/', controllers.GetUser)
router.post('/signup', controllers.SignupWithEmail)
router.post('/signin', controllers.SigninWithEmail)
router.get('/signout', controllers.Signout)


module.exports = router;