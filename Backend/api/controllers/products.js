const { putProductReview, getProductReview, postProductReview, deleteProductCategories, postProductCategories, deleteProductById, putProductById, getProductById, postProduct, putProductImageById, getProductQuantityType, getProductsByVendorID, getProductCategories } = require('../services/products')

const PutProductReview = async (req, res) => {
    try {
        const { id: product_id } = req.params;
        const { id: review_id } = req.query;
        const data = req.body;
        const review = await putProductReview(product_id, review_id, data);
        res.status(200).json(review);
    } catch (error) {
        res.status(500).send(error);
    }
}
const GetProductReview = async (req, res) => {
    try {
        const { id: review_id } = req.query;
        const review = await getProductReview(review_id);
        res.status(200).json(review);

    } catch (error) {
        res.status(500).send(error);
    }
}

const PostProductReview = async (req, res) => {
    try {
        const { id: product_id } = req.params;
        const { visitor_id, rating, review } = req.body;
        const productReview = await postProductReview({product_id, visitor_id, rating, review});
        res.status(200).json(productReview);
    } catch (error) {
        res.status(500).send(error);
    }
}



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
        const categories = await getProductCategories(id);
        res.status(200).json({product, categories});
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
        const { vendor_id, name, price, quantity, quantity_type, categories } = req.body;
        const product = await postProduct({vendor_id, name, price, quantity, quantity_type});
        console.log(categories);
        for (category in categories) {
            await postProductCategories(product.id, categories[category]);
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const PutProductById = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, price, quantity, quantity_type, categories } = req.body;

        const product = await putProductById(id, {name, price, quantity, quantity_type});
        const deleteCategories = await deleteProductCategories(id);
        for (category in categories) {
            await postProductCategories(id, categories[category]);
        }
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
    GetProductReview,
    PostProductReview,
    PutProductReview,
    DeleteProductById,
    PutProductById,
    GetProductById,
    PutProductImageById,
    PostProduct,
    GetProductQuantityType,
    GetProductsByVendorID,
}