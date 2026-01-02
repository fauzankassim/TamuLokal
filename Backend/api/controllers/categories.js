const {   getVendorsByCategoryId } = require('../services/categories')


const GetVendorsByCategoryId = async (req, res) => {
    try {
        const id = req.params.id;
        const vendors = await getVendorsByCategoryId(id);
        res.status(200).json(vendors);
    } catch (error) {
        res.status(500).send(error);
    }
}

module.exports = {
    GetVendorsByCategoryId
};