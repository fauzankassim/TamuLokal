const { supabase } = require('../../db')

const deleteUserFollow = async (follower_id, following_id) => {
    const { data, error } = await supabase
        .from("account_follow")
        .delete()
        .eq("follower_id", follower_id)
        .eq("following_id", following_id);

}

const getUserFollow = async (follower_id, following_id) => {
    const { data, error } = await supabase
        .from("account_follow")
        .select("*")
        .eq("follower_id", follower_id)
        .eq("following_id", following_id);

    return data;
}
const postUserFollow = async (follower_id, following_id) => {
    const { data, error } = await supabase
        .from("account_follow")
        .insert(
            {follower_id, following_id}
        )
        .select();

    return data;
}
const getUserByQuery = async (query) => {
    const { data, error } = await supabase
        .rpc('search_profiles', {
            p_search: query
        });
    
    return data;
}
const getUserRolesById = async (id) => {
    const { data, error } = await supabase
        .from("user_roles")
        .select("role(title)")
        .eq("user_id", id);

    if (error) throw error;

        // Extract role names
    const roles = data.map((r) => r.role.title);

    return {
        vendorExists: roles.includes("Vendor"),
        organizerExists: roles.includes("Organizer"),
        visitorExists: roles.includes("Visitor"),
        roles,
    };
};

module.exports = {
    deleteUserFollow,
    getUserFollow,
    postUserFollow,
    getUserByQuery,
    getUserRolesById,
};