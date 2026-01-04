const { supabase } = require('../../db');

const postMarketspaceApplication = async (space_id, vendor_id, image) => {
  const { data, error } = await supabase
    .from("space_applications")
    .insert({
      space_id,
      vendor_id,
      image
    })
    .select()
    .single();

  return data;
}

const getMarketspaceById = async (marketspace_id) => {
  const { data, error } = await supabase
    .from("space")
    .select("*")
    .eq("id", marketspace_id)
    .single();

  return data;
}

const getAvailableMarketspace = async () => {
  const { data, error } = await supabase.rpc("get_available_marketspace_per_market");

  return data;
}

const deleteMarketspaceProduct = async (space_id, product_id) => {
  const { data, error } = await supabase
    .from("space_product")
    .delete()
    .eq("space_id", space_id)
    .eq("product_id", product_id);

  return data;
}

const getMarketspaceProduct = async (space_id, product_id) => {
  const { data, error } = await supabase
    .from("space_product")
    .select("*")
    .eq("space_id", space_id)
    .eq("product_id", product_id)
    .select()
    .single();

  return data;
}

const postMarketspaceProduct = async (space_id, product_id) => {
    const { data, error } = await supabase
        .from("space_product")
        .insert({
            space_id,
            product_id,
        })
        .select()
        .single();

    return data;
}

const putMarketspaceState = async (space_id, state) => {
  const { data, error } = await supabase
    .from("space")
    .update({
      state
    })
    .eq("id", space_id)
    .select()
    .single();

  return data;
}


const getMarketspaceByMarketId = async (market_id) => {
  const { data, error } = await supabase
    .from("space")
    .select("*")
    .eq("market_id", market_id);

  return data;
}
const getMarketspaceByVendorId = async (vendor_id) => {
  const { data, error } = await supabase.rpc(
    'get_vendor_spaces', {
      v_uuid: vendor_id
    }
  );

  return data;
}


const getMarketspaceByOrganizerId = async (organizer_id) => {
  const { data, error } = await supabase.rpc(
    'get_organizer_spaces', {
      o_uuid: organizer_id
    }
  );
  return data;
}

module.exports = {
  postMarketspaceApplication,
  getMarketspaceById,
  getAvailableMarketspace,
  deleteMarketspaceProduct,
  getMarketspaceProduct,
  postMarketspaceProduct,
  putMarketspaceState,
  getMarketspaceByMarketId,
  getMarketspaceByOrganizerId,
  getMarketspaceByVendorId
}