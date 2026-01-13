const { supabase } = require('../../db')

const deleteOrganizer = async (organizer_id) => {
  const { data, error } = await supabase
    .from("organizer")
    .delete()
    .eq("id", organizer_id);
}

const putVerification = async (organizer_id, verified) => {

  const { data, error }= await supabase
    .from("organizer")
    .update({verified})
    .eq("id", organizer_id)
    .select()
    .single();

  console.log(error);
  return data;
}

const getVerification = async (organizer_id) => {
  const { data, error } = await supabase
    .from("organizer")
    .select("verified")
    .eq("id", organizer_id)
    .single();

  return data;
}


const getOrganizerMarketById = async (id) => {
  const { data, error } = await supabase.rpc("get_organizer_market", {p_organizer_id: id});


  return data;
}

const getOrganizerProfileById = async (id) => {
    const { data, error } = await supabase.rpc('get_business_profile', { user_id: id}).single();

    return data;
};






const getOrganizers = async () => {
  const { data, error } = await supabase
    .from("organizer")
    .select("*");

  return data;
}

const postOrganizer = async (organizer) => {
  const { data, error } = await supabase
    .from("organizer")
    .insert(organizer)
    .select()
    .single();

  return data;
};

const putOrganizerProfileById = async (id, update) => {
    const { data, error } = await supabase.rpc('update_business_profile', {
        user_id: id,
        new_username: update.username,
        new_fullname: update.fullname,
        new_image: update.image
    })

    return data;
}

const putOrganizerImageById = async (id, image) => {
    const { data, error } = await supabase
        .from('organizer')
        .update({
            image
        })
        .eq('id', id)
        .select()
        .single();

    return data;
}


module.exports = {
  deleteOrganizer,
  putVerification,
  getVerification,
  getOrganizers,
  getOrganizerMarketById,
    putOrganizerProfileById,
    putOrganizerImageById,
    getOrganizerProfileById,
    postOrganizer,
}