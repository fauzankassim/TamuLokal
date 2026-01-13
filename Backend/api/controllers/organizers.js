const { deleteOrganizer, putVerification, getVerification, getOrganizers, getOrganizerMarketById, putOrganizerImageById, getOrganizerProfileById, postOrganizer, putOrganizerProfileById} = require('../services/organizers')

const DeleteOrganizer = async (req, res) => {
    try {
        const { id: organizer_id } = req.params;
        const organizer = await deleteOrganizer(organizer_id);
        res.status(200).json(organizer);
    } catch (error) {
        res.status(500).send(error);
    }
}

const PutVerification = async (req, res) => {
    try {
        const { id: organizer_id } = req.params;
        const { verified } = req.query;
        const verification = await putVerification(organizer_id, verified);
        res.status(200).json(verification);
    } catch (error) {
        res.status(500).send(error);
    }
}

const GetVerification = async (req, res) => {
    try {
        const { id: organizer_id } = req.params;
        const verification = await getVerification(organizer_id);
        res.status(200).json(verification);
    } catch (error) {
        res.status(500).send(error);
    }
}
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
    DeleteOrganizer,
    PutVerification,
    GetVerification,
    GetOrganizers,
    GetOrganizerMarketById,
    PutOrganizerProfileById,
    PutOrganizerImageById,
    PostOrganizer,
    GetOrganizerProfileById
}