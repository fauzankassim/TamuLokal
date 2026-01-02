const { supabase } = require('../../db')


const getVendorsByCategoryId = async (id) => {
  const { data, error } = await supabase.rpc('get_vendors_by_category', {category_id_input: id});

  return data;
}

module.exports = {
    getVendorsByCategoryId
};