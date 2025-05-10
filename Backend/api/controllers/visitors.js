const { allVisitors, getVisitor } = require('../services/visitors')

const getVisitors = async (req, res) => {
    try {
        const visitors = await allVisitors();
        res.status(200).json(visitors)
    }
    catch (err) {
    res.status(500).send(err)
    }
}

const getVisitorById = async (req, res) => {
    try {
        const id = req.params.id;
        const visitor = await getVisitor(id);
        res.status(200).json(visitor);
    }
    catch (err) {
    res.status(500).send(err)
    }
}

module.exports = {
    getVisitors,
    getVisitorById
}