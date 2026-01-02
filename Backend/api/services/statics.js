const { supabase } = require('../../db')

const getFrequencyType = async () => {
    const { data, error } = await supabase
        .from("frequency")
        .select("*");

    return data;
}

module.exports = {
    getFrequencyType,
}