const { postForum, postContentCommentReply, getContentEngagement, postContentComment, getContentComment, getLikeContent, deleteLikeContent, postLikeContent, postPost, putPostImageById, getForums, getAllPosts, getFriendPosts } = require('../services/contents')

const PostContentCommentReply = async (req, res) => {
    try {
        const reply = await postContentCommentReply(req.body);
        res.status(200).json(reply);
    } catch (error) {
        res.status(500).send(error);
    }
}
const GetContentEngagement = async (req, res) => {
    try {
        const id = req.params.id;
        const engagement = await getContentEngagement(id);
        res.status(200).json(engagement);
    } catch (error) {
        res.status(500).send(error);
    }
}

const PostContentComment = async (req, res) => {
    try {
        const comment = await postContentComment(req.body);
        res.status(200).json(comment); 
    } catch (error) {
        res.status(500).send(error);
    }
}
const GetContentComment = async (req, res) => {
    try {
        const content_id = req.params.id;
        const comment = await getContentComment(content_id);
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).send(error);
    }
}

const GetLikeContent = async (req, res) => {
    try {
        const { content_id, visitor_id } = req.query;

        const like = await getLikeContent(content_id, visitor_id);
        res.status(200).json(like);
    } catch (error) {
        res.status(500).send(error);
    }
}

const DeleteLikeContent = async (req, res) => {
    try {
        const { content_id, visitor_id } = req.query;
        const like = await deleteLikeContent(content_id, visitor_id);
        res.status(200).json(like); 
    } catch (error) {
        res.status(500).send(error);
    }
}

const PostLikeContent = async (req, res) => {
    try {
        const { content_id, visitor_id } = req.body;
        const like = await postLikeContent(content_id, visitor_id);
        res.status(200).json(like);
    } catch (error) {
        res.status(500).send(error);
    }
}

const PostContent = async (req, res) => {
    try {
        const { type } = req.query;

        let content;
        if (type == "post") {
            content = await postPost(req.body);
        } else {
            content = await postForum(req.body);   
        }
        res.status(200).json(content);
    } catch (error) {
        res.status(500).send(error);
    }
}

const PostPost = async (req, res) => {
    try {
        const post = await postPost(req.body);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).send(error);
    }
}

const PutPostImageById = async (req, res) => {
    try {
        const id = req.params.id;
        const { image } = req.body;
        const post = await putPostImageById(id, image);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).send(error);
    }
}

const GetPosts = async (req, res) => {
    try {
        const { visitor_id } = req.query;

        let posts;
        if (visitor_id) {
            posts = await getFriendPosts(visitor_id);
        } else {
            posts = await getAllPosts();
        }

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).send(error);
    }
}

const GetForums = async (req, res) => {
    try {
        const forums = await getForums();
        res.status(200).json(forums);
    } catch (error) {
        res.status(500).send(error);
    }
}

module.exports = {
    PostContentCommentReply,
    GetContentEngagement,
    PostContentComment,
    PostContent,
    GetContentComment,
    GetLikeContent,
    DeleteLikeContent,
    PostLikeContent,
    PostPost,
    PutPostImageById,
    GetForums,
    GetPosts,
}