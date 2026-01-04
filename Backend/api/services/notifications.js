const { supabase } = require('../../db');

const getNotification = async (recipient_id) => {
    const { data, error } = await supabase 
        .from("notification")
        .select("*")
        .eq('recipient_id', recipient_id);


    return data;
}

const putNotificationIsRead = async (id) => {
    const { data, error } = await supabase
        .from("notification")
        .update({ is_read: 'true'})
        .eq("id", id)
        .select()
        .single();


    return data;
}

module.exports = {
    putNotificationIsRead,
    getNotification
};