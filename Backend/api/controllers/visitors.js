const { allVisitors } = require('../services/visitors')

const getVisitors = async (req, res) => {
    try {
        const visitors = await allVisitors();
        res.json(visitors)
    }
    catch (err) {
    res.status(500).send(err)
    }
}

module.exports = {
    getVisitors
}