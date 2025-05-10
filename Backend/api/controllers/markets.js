const { allMarkets, getMarket } = require('../services/visitors')

const getMarkets = async (req, res) => {
    try {
        const markets = await allMarkets();
        res.status(200).json(markets)
    }
    catch (err) {
    res.status(500).send(err)
    }
}

const getMarketById = async (req, res) => {
    try {
        const id = req.params.id;
        const market = await getMarket(id);
        res.status(200).json(market);
    }
    catch (err) {
    res.status(500).send(err)
    }
}

module.exports = {
    getMarkets,
    getMarketById
}