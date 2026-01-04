const { supabase } = require('../../db')


const getContentEngagement = async (content_id) => {
    const { data, error } = await supabase.rpc("get_content_engagement", {p_content_id: content_id}).single();

    return data;
}

const postContentCommentReply = async (reply) => {
    const { data, error } = await supabase
        .from("comment_reply")
        .insert([reply])
        .select();

    return data;
}
const postContentComment = async (comment) => {
    const { data, error } = await supabase
        .from("content_comment")
        .insert([comment])
        .select();

    return data;
}
const getContentComment = async (content_id) => {
    const { data, error } = await supabase.rpc("get_content_comments_with_replies", {p_content_id: content_id});

    return data;
}
const getLikeContent = async (content_id, visitor_id) => {
    const { data, error } = await supabase
        .from("content_like")
        .select("*")
        .eq("content_id", content_id)
        .eq("visitor_id", visitor_id);
    
    return data;
}

const deleteLikeContent = async (content_id, visitor_id) => {
    const { data, error } = await supabase
        .from("content_like")
        .delete()
        .eq('content_id', content_id)
        .eq('visitor_id', visitor_id)

}

const postLikeContent = async (content_id, visitor_id) => {
    const { data, error } = await supabase
        .from("content_like")
        .insert(
            {content_id, visitor_id}
        )
        .select();

    return data;
}

const getAllPosts = async () => {
    const { data, error } = await supabase.rpc("get_all_content_posts");
    
    return data;
}

const getFriendPosts = async (id) => {
    const { data, error } = await supabase.rpc("get_following_content", { p_follower_id: id });


    return data;
}

const getForums = async () => {
    const { data, error } = await supabase
        .from("content")
        .select("*")
        .eq("type.type", "Forum");
    
    return data;
}

const postPost = async (content) => {
    const { data, error } = await supabase
        .from("content")
        .insert([content])
        .select()
        .single();

    return data;
}

const putPostImageById = async(id, image) => {
    const { data, error } = await supabase
        .from("content")
        .update({image})
        .eq('id', id)
        .select()
        .single();

    return data;
}

module.exports = {
    postContentCommentReply,
    getContentEngagement,
    postContentComment,
    getContentComment,
    getLikeContent,
    deleteLikeContent,
    postLikeContent,
    postPost,
    putPostImageById,
    getAllPosts,
    getFriendPosts,
    getForums,
}