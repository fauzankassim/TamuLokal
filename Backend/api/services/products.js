const { supabase } = require('../../db')


const getProductReview = async (review_id) => {
    const { data, error } = await supabase
        .from("product_review")
        .select("*")
        .eq("id", review_id)
        .single();

    return data;
}

const postProductReview = async (review) => {
    const { data, error } = await supabase
        .from("product_review")
        .insert(review)
        .select()
        .single();

    return data;
}

const putProductReview = async (product_id, review_id, review) => {
    const { data, error } = await supabase
        .from("product_review")
        .update(review)
        .eq("product_id", product_id)
        .eq("id", review_id)
        .single();

    return data;
}

const getProductsByVendorID = async (id) => {
    const { data, error } = await supabase.rpc("get_products_by_vendor", {p_vendor_id: id});

    return data;
};

const getProductById = async (id) => {
    const { data, error } = await supabase.rpc("get_product_by_id", {p_product_id: id}).single();

    return data;
}

const getProductQuantityType = async() => {
    const { data, error } = await supabase
        .from("quantity_type")
        .select("*");


    return data;
}

const postProduct = async (product) => {
    const { data, error } = await supabase.from('product').insert([product]).select().single();

    return data; // return the first inserted product
}

const putProductById = async (id, product) => {

    const { data, error } = await supabase
        .from('product')
        .update([product])
        .eq('id', id)
        .select()
        .single();

    return data;
}
const putProductImageById = async (id, image) => {
    const { data, error } = await supabase
        .from('product')
        .update({ image })
        .eq('id', id)
        .select();

    console.log(error);
    return data;
}

const getProductCategories = async (product_id) => {
    const {data , error } = await supabase
        .from("product_categories")
        .select("*")
        .eq("product_id", product_id);


    return data;
}
const postProductCategories = async (product_id, category_id) => {
    const { data, error } = await supabase
        .from('product_categories')
        .insert({ product_id, category_id });

}

const deleteProductCategories = async (product_id) => {
    const { data, error } = await supabase
        .from("product_categories")
        .delete()
        .eq("product_id", product_id);
}

const deleteProductById = async (id) => {
    const { data, error } = await supabase
        .from('product')
        .delete()
        .eq('id', id);

    return data;
}

module.exports = {
    getProductReview,
    postProductReview,
    putProductReview,
    getProductCategories,
    deleteProductCategories,
    postProductCategories,
    deleteProductById,
    putProductById,
    getProductById,
    postProduct,
    putProductImageById,
    getProductQuantityType,
    getProductsByVendorID,
};