const { supabase } = require('../../db')



const getProductsByVendorID = async (id) => {
    const { data, error } = await supabase.from('product').select('*').eq('vendor_id', id);

    return data;
};

const getProductById = async (id) => {
    const { data, error } = await supabase
        .from('product')
        .select('*')
        .eq('id', id)
        .single();

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

const deleteProductById = async (id) => {
    const { data, error } = await supabase
        .from('product')
        .delete()
        .eq('id', id);

    return data;
}

module.exports = {
    deleteProductById,
    putProductById,
    getProductById,
    postProduct,
    putProductImageById,
    getProductQuantityType,
    getProductsByVendorID,
};