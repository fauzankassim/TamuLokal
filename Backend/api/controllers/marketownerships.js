const { getMarketOwnershipByOrganizerId }= require('../services/marketownerships')
const GetMarketOwnershipByOrganizerId = async (req, res) => {
    try {
        const id = req.query.organizer_id;
        const markets = await getMarketOwnershipByOrganizerId(id);

        res.status(200).json(markets);
    } catch (err) {
        res.status(500).send(err);
    }
}
module.exports = {
    GetMarketOwnershipByOrganizerId
}