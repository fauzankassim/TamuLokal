const { supabase } = require('../../db')

const allMarkets = async () => {
    const { data, error } = await supabase.from('Tamu').select('*')

    return data;
};

const getMarket = async (id) => {
    const { data, error } = await supabase.from('Tamu').select('*').eq('TamuID', id).single();

    return data;
};

module.exports = {
    allVisitors,
    getVisitor
};
