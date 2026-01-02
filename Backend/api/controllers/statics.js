const { getFrequencyType } = require('../services/statics')

const GetFrequencyType = async(req, res) => {
    try {
        const frequencies = await getFrequencyType();
        res.status(200).json(frequencies);
    } catch (err) {
        res.status(500).send(err);
    }
}

module.exports = {
    GetFrequencyType,
}