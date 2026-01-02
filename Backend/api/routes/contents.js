const controllers = require('../controllers/contents')
const router = require('express').Router()

router.post("/reply", controllers.PostContentCommentReply)
router.get("/:id/engagement", controllers.GetContentEngagement)
router.post("/:id/comment", controllers.PostContentComment)
router.get("/:id/comment", controllers.GetContentComment)
router.get("/like", controllers.GetLikeContent)
router.delete("/like", controllers.DeleteLikeContent)
router.post("/like", controllers.PostLikeContent)
router.post("/", controllers.PostContent)
router.put("/:id/image", controllers.PutPostImageById)
router.get("/post", controllers.GetPosts)
router.get("/forum", controllers.GetForums)

module.exports = router;