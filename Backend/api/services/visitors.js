const { supabase } = require('../../db')

const allVisitors = async () => {
    const { data, error } = await supabase.from('Visitor').select('*')

    return data;
};

const getVisitor = async (id) => {
    const { data, error } = await supabase.from('Visitor').select('*').eq('VisitorID', id).single();

    return data;
};

module.exports = {
    allVisitors,
    getVisitor
};
