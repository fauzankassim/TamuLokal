const controllers = require('../controllers/visitors')
const router = require('express').Router()

router.get('/', controllers.GetVisitors)
router.post('/', controllers.PostVisitor)
router.get('/:id', controllers.GetVisitorById)
router.put('/:id', controllers.PutVisitorById)
router.delete('/:id', controllers.DeleteVisitorById)

module.exports = router;
