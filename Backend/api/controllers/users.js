const { getProfile, postUserClick, deleteUserFollow, getUserFollow, postUserFollow, getUserByQuery ,getUserRolesById } = require('../services/users')

const GetProfile = async (req, res) => {
    try { 
        const { id: user_id } = req.params;
        const profile = await getProfile(user_id);
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).send(error);
    }
}

const PostUserClick = async (req, res) => {
    try {
        const { id: viewed_id } = req.params;
        const { viewer_id } = req.body;
        const click = await postUserClick(viewer_id, viewed_id);
        res.status(200).json(click);
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
}

const DeleteUserFollow = async (req, res) => {
    try {
        const { follower_id, following_id } = req.query;
        const account = await deleteUserFollow(follower_id, following_id);
        res.status(200).json(account);
    } catch (error) {
        res.status(500).send(error);
    }
}
const GetUserFollow = async (req, res) => {
    try { 
        const { follower_id, following_id } = req.query;
        const account = await getUserFollow(follower_id, following_id);
        res.status(200).json(account);
    } catch (error) {
        res.status(500).send(error);
    }
}
const PostUserFollow = async (req, res) => {
    try {
        const { follower_id, following_id } = req.body;
        const account = await postUserFollow(follower_id, following_id);
        res.status(200).json(account);
    } catch (error) {
        res.status(500).send(error)
    }
}

const GetUserRolesById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await getUserRolesById(id);
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).send(err)
    }
}

const GetUserByQuery = async (req, res) => {
    try {
        const query = req.query.search;
        const users = await getUserByQuery(query);
        res.status(200).json(users);
    } catch (err) {
        res.status(500).send(err);
    }
}


module.exports = {
    GetProfile,
    PostUserClick,
    DeleteUserFollow,
    GetUserFollow,
    PostUserFollow,
    GetUserByQuery,
    GetUserRolesById
}