const { supabase } = require('../../db')

const allVisitors = async () => {
    const { data, error } = await supabase.from('Visitor').select('*')

    return data;
};

module.exports = {
    allVisitors
};
