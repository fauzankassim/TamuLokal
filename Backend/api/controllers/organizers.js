const { getOrganizers, getOrganizerMarketById, putOrganizerImageById, getOrganizerProfileById, postOrganizer, putOrganizerProfileById} = require('../services/organizers')

const GetOrganizers = async (req, res) => {
    try {
        const organizers = await getOrganizers();
        res.status(200).json(organizers);
    } catch (error) {
        res.status(500).send(error);
    }
}

const GetOrganizerMarketById = async (req, res) => {
    try {
        const id = req.params.id;

        const markets = await getOrganizerMarketById(id);
        res.status(200).json(markets);
    } catch (err) {
        res.status(500).send(err);
    }
}


const PostOrganizer = async (req, res) => {
    try {
        const data = req.body;
        const organizer = await postOrganizer(data);
        res.status(200).json(organizer);
    } catch (err) {
        res.status(500).send(err);
    }
}

const GetOrganizerProfileById = async (req, res) => {
    try {
        const id = req.params.id;
        const organizer = await getOrganizerProfileById(id);
        res.status(200).json(organizer);
    }
    catch (err) {
        res.status(500).send(err)
    }
}

const PutOrganizerImageById = async (req, res) => {
    try {
        const id = req.params.id;
        const { image } = req.body;
        const organizer = await putOrganizerImageById(id, image);
        res.status(200).json(organizer);
    } catch (err) {
        res.status(500).send(err);
    }
}

const PutOrganizerProfileById = async (req, res) => {
    try {
        const id = req.params.id;
        const update = req.body;
        const organizer = await putOrganizerProfileById(id, update);
        res.status(200).json(organizer);
    } catch (err) {
        res.status(500).send(err);
    }
}

module.exports = {
    GetOrganizers,
    GetOrganizerMarketById,
    PutOrganizerProfileById,
    PutOrganizerImageById,
    PostOrganizer,
    GetOrganizerProfileById
}