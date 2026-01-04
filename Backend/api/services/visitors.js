const { supabase } = require('../../db')


const getContent = async (visitor_id) => {
    const {data, error } = await supabase
        .from("content")
        .select("*")
        .eq("visitor_id", visitor_id);

    return data;
}
const putMarketReview = async (review_id, rating, review) => {
    const { data, error } = await supabase
        .from("market_review")
        .update({
            rating,
            review
        })
        .eq("id", review_id)
        .select()
        .single();

    return data;
}
const getMarketReview = async (visitor_id, review_id) => {
    const { data, error } = await supabase
        .from("market_review")
        .select("*")
        .eq("visitor_id", visitor_id)
        .eq("id", review_id)
        .single();

    return data;
}

const getMarketBookmark = async (visitor_id) => {
    const { data, error } = await supabase
        .rpc("get_market_bookmark_as_visitor", {
            p_visitor_id: visitor_id
        });

    return data;
}

const getMarketHistory = async (visitor_id) => {
    const { data, error } = await supabase
        .rpc("get_market_history_as_visitor", {
            p_visitor_id: visitor_id
        });

    return data;
}

const getVisitors = async () => {
    const { data, error } = await supabase.from('visitor').select('*');

    return data;
};

const getVisitorProfileById = async (id) => {
    const { data, error } = await supabase.rpc('get_profile', { user_id: id}).single();

    return data;
};

const putVisitorImageById = async (id, image) => {
    const { data, error } = await supabase
        .from('visitor')
        .update({
            image
        })
        .eq('id', id)
        .select()
        .single();

    return data;
}

const postVisitor = async (newVisitor) => {

    const { data, error } = await supabase
        .from('visitor')
        .insert([
            newVisitor, 
        ])
        .select();

    return data; 
}

const putVisitorById = async (id, updates) => {

    const { data, error } = await supabase.rpc("update_visitor_profile", {
            p_user_id: id,
            p_new_username: updates.username,
            p_new_fullname: updates.fullname,
            p_new_image: updates.image
        })
        .single();
    
    return data;
}

const deleteVisitorById = async (id) => {
    const { error } = await supabase
        .from('visitor')
        .delete()
        .eq('id', id)

}


const getVisitorVisitedMarket = async (id) => {

    const { data, error } = await supabase.rpc("get_visited_markets", {p_visitor_id: id});

    return data;
}

module.exports = {
    getContent,
    putMarketReview,
    getMarketReview,
    getMarketBookmark,
    getMarketHistory,
    getVisitorVisitedMarket,
    putVisitorImageById,
    getVisitors,
    getVisitorProfileById,
    postVisitor,
    putVisitorById,
    deleteVisitorById
};
