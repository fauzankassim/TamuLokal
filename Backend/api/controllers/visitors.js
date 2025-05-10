const { getVisitors, getVisitorById, postVisitor, putVisitor, deleteVisitorById, putVisitorById } = require('../services/visitors')

const GetVisitors = async (req, res) => {
    try {
        const visitors = await getVisitors();
        res.status(200).json(visitors)
    }
    catch (err) {
    res.status(500).send(err)
    }
}

const GetVisitorById = async (req, res) => {
    try {
        const id = req.params.id;
        const visitor = await getVisitorById(id);
        res.status(200).json(visitor);
    }
    catch (err) {
        res.status(500).send(err)
    }
}

const PostVisitor = async (req, res) => {
    try {
        const { Username, Email, Password } = req.body;
        
        const visitor = await postVisitor(Username, Email, Password);
        res.status(200).json(visitor);
    }
    catch (err) {
        res.status(500).send(err)
    }

}

const PutVisitorById = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        const visitor = await putVisitorById(id, updates);
        res.status(200).json(visitor);
    }
    catch (err) {
        res.status(500).send(err)
    }
}

const DeleteVisitorById = async (req, res) => {
    try {
        const id = req.params.id;
        await deleteVisitorById(id);
        res.status(200).send("Successfully deleted")
    }
    catch (err) {
        res.status(500).send(err)
    }
}


module.exports = {
    GetVisitors,
    PostVisitor,
    GetVisitorById,
    PutVisitorById,
    DeleteVisitorById
}