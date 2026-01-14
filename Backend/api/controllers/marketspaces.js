const { putMarketspaceApplication, postMarketspaceApplication, getMarketspaceById, getAvailableMarketspace, deleteMarketspaceProduct, getMarketspaceProduct, postMarketspaceProduct, putMarketspaceState, getMarketspaceByMarketId, getMarketspaceByOrganizerId, getMarketspaceByVendorId }= require('../services/marketspaces')

const PutMarketspaceApplication = async (req, res) => {
    try {
        const { application_id } = req.query;
        const { status } = req.body;
        const application = await putMarketspaceApplication(application_id, status)
        res.status(200).json(application)
    } catch (error) {
        res.status(500).send(error);
    }
}

const PostMarketspaceApplication = async (req, res) => {
    try {
        const { id: space_id } = req.params;
        const { vendor_id } = req.body;
        const image = `vendors/${vendor_id}/marketspaces/${space_id}/`
        const application = await postMarketspaceApplication(space_id, vendor_id, image);
        res.status(200).json(application);
    } catch (error) {
        res.status(500).send(error);
    }
}

const GetMarketspaceById = async (req, res) => {
    try {
        const { id: marketspace_id } = req.params;
        const marketspace = await getMarketspaceById(marketspace_id);
        res.status(200).json(marketspace);
    } catch (error) {
        res.status(500).send(error);
    }
}

const GetAvailableMarketspace = async (req, res) => {
    try {
        const marketspaces = await getAvailableMarketspace();
        res.status(200).json(marketspaces);
    } catch (error) {
        res.status(500).send(error);
    }
}

const DeleteMarketspaceProduct = async (req, res) => {
    try {
        const { id: space_id } = req.params;
        const { product_id } = req.query;
        const product = await deleteMarketspaceProduct(space_id, product_id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).send(error);
    }
}

const GetMarketspaceProduct = async (req, res) => {
    try {
        const { id: space_id } = req.params;
        const { product_id } = req.query;
        const product = await getMarketspaceProduct(space_id, product_id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).send(error);
    }
}

const PostMarketspaceProduct = async (req, res) => {
    try {
        const { id: space_id } = req.params;
        const { product_id } = req.body;
        const product = await postMarketspaceProduct(space_id, product_id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).send(error);
    }
}

const PutMarketspaceState = async (req, res) => {
    try {
        const { id: space_id } = req.params;
        const { state } = req.body;
        const marketspace = await putMarketspaceState(space_id, state);
        res.status(200).json(marketspace);
    } catch (error) {
        res.status(500).send(error);
    }
}

const GetMarketspaceByMarketId = async (req, res) => {
    try {
        const id = req.params.id;
        const marketspace = await getMarketspaceByMarketId(id);
        res.status(200).json(marketspace);
    } catch (error) {
        res.status(500).send(error);
    }
}

const GetMarketspaceByAccountId = async (req, res) => {
    try {
        const { vendor_id, organizer_id } = req.query;

        if (vendor_id) {
            spaces = await getMarketspaceByVendorId(vendor_id);
        } else {
            spaces = await getMarketspaceByOrganizerId(organizer_id);

        }
        
        res.status(200).json(spaces);
    } catch (error) {
        res.status(500).send(error);
    }
}
const GetMarketspaceByVendorId = async (req, res) => {
    try {
        const id = req.query.vendor_id;
        const spaces = await getMarketspaceByVendorId(id);

        res.status(200).json(spaces);
    } catch (err) {
        res.status(500).send(err)
    }
}

const GetMarketspaceByOrganizerId = async (req, res) => {
    try {
        const id = req.query.organizer_id;
        const markets = await getMarketspaceByOrganizerId(id);

        res.status(200).json(markets);
    } catch (error) {
        res.status(500).send(error);
    }
}


module.exports = {
    PutMarketspaceApplication,
    PostMarketspaceApplication,
    GetMarketspaceById,
    GetAvailableMarketspace,
    DeleteMarketspaceProduct,
    GetMarketspaceProduct,
    PostMarketspaceProduct,
    PutMarketspaceState,
    GetMarketspaceByAccountId,
    GetMarketspaceByOrganizerId,
    GetMarketspaceByVendorId
}