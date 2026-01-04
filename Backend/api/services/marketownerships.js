const { supabase } = require('../../db')

const getMarketOwnershipByOrganizerId = async (organizer_id) => {

  const { data, error } = await supabase.rpc(
    'get_market_ownership_summary', {
      p_organizer_id: organizer_id
    }
  );

  return data; 
}

module.exports = {
    getMarketOwnershipByOrganizerId
}