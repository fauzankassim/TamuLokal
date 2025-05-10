const { supabase } = require('../../db')

const getVisitors = async () => {
    const { data, error } = await supabase.from('Visitor').select('*')

    return data;
};

const getVisitorById = async (id) => {
    const { data, error } = await supabase.from('Visitor').select('*').eq('VisitorID', id).single();

    return data;
};

const postVisitor = async (username, email, password) => {

    const { data, error } = await supabase
        .from('Visitor')
        .insert([
            {Username: username, Email: email, Password: password}, 
        ])
        .select();

    return data; 
}

const putVisitorById = async (id, updates) => {

    const { data, error } = await supabase
        .from('Visitor')
        .update(updates)
        .eq('VisitorID', id)
        .select();


    return data;
}

const deleteVisitorById = async (id) => {
    const { error } = await supabase
        .from('Visitor')
        .delete()
        .eq('VisitorID', id)

    console.log(error);
}


module.exports = {
    getVisitors,
    getVisitorById,
    postVisitor,
    putVisitorById,
    deleteVisitorById
};
