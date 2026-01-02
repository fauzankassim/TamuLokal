const { deleteProductById, putProductById, getProductById, postProduct, putProductImageById, getProductQuantityType, getProductsByVendorID } = require('../services/products')



const DeleteProductById = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await deleteProductById(id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).send(error);
    }
}

const GetProductById = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await getProductById(id);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).send(err);
    }
}
const GetProductsByVendorID = async (req, res) => {
    try {
        const { vendor_id } = req.query;
        const products = await getProductsByVendorID(vendor_id);
        res.status(200).json(products);
    }
    catch (err) {
    res.status(500).send(err)
    }
}

const GetProductQuantityType = async (req, res) => {
    try {
        const qtype = await getProductQuantityType();

        res.status(200).json(qtype);
    }
    catch (err) {
    res.status(500).send(err)
    }
}

const PostProduct = async (req, res) => {
    try {
        const product = await postProduct(req.body);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const PutProductById = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        const product = await putProductById(id, data);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).send(err)
    }
}

const PutProductImageById = async (req, res) => {
    try {
        const id = req.params.id;
        const { image } = req.body;
        const product = await putProductImageById(id, image);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).send(err.message);
    }
}


module.exports = {
    DeleteProductById,
    PutProductById,
    GetProductById,
    PutProductImageById,
    PostProduct,
    GetProductQuantityType,
    GetProductsByVendorID,
}