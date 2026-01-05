const { supabase } = require('../../db')

const getOrganizers = async () => {
  const { data, error } = await supabase
    .from("organizer")
    .select("*");

  return data;
}

const getOrganizerMarketById = async (id) => {
  const { data, error } = await supabase
    .from("market")
    .select("*")
    .eq("organizer_id", id);


  return data;
}

const getOrganizerProfileById = async (id) => {
    const { data, error } = await supabase.rpc('get_business_profile', { user_id: id}).single();

    return data;
};

const postOrganizer = async (organizer) => {
  // 1️⃣ Insert organizer row
  const { data: organizerData, error: organizerError } = await supabase
    .from("organizer")
    .insert({
      id: organizer.user_id,
      name: organizer.businessName,
      license: organizer.businessLicense,
    })
    .select();

  if (organizerError) {
    console.error("organizer insert error:", organizerError);
    return { error: organizerError };
  }

  // 2️⃣ Update visitor info
  const { data: visitorData, error: visitorError } = await supabase
    .from("visitor")
    .update({
      username: organizer.username,
      fullname: organizer.fullName,
      nric: organizer.nric,
    })
    .eq("id", organizer.user_id)
    .select();

  if (visitorError) {
    console.error("Visitor update error:", visitorError);
  }

  // 3️⃣ Create organizer folder in storage
  const folderPath = `organizers/${organizer.user_id}/`;

  // Supabase doesn’t allow empty folders — we upload a dummy file to "create" it
  const { error: uploadError } = await supabase.storage
    .from('tamulokal')
    .upload(`${folderPath}init.txt`, 'folder initialized', {
      upsert: false,
    });

  if (uploadError && uploadError.message !== 'The resource already exists') {
    throw uploadError;
  }

  // 4️⃣ Generate the public URL
  const { data: publicUrlData } = supabase.storage
    .from("tamulokal")
    .getPublicUrl(`${folderPath}init.txt`);

  const folderUrl = publicUrlData.publicUrl;

  // 5️⃣ Update organizer row with image path (folder link)
  const { data: updatedorganizer, error: updateError } = await supabase
    .from("organizer")
    .update({ image: folderUrl })
    .eq("id", organizer.user_id)
    .select();

  if (updateError) {
    console.error("Failed to update organizer image path:", updateError);
  }

  return {
    organizerData: updatedorganizer || organizerData,
    visitorData,
    folderUrl,
  };
};

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

const putOrganizerProfileById = async (id, update) => {
    const { data, error } = await supabase.rpc('update_business_profile', {
        user_id: id,
        new_username: update.username,
        new_fullname: update.fullname,
        new_image: update.image
    })

    return data;
}

module.exports = {
  getOrganizers,
  getOrganizerMarketById,
    putOrganizerProfileById,
    putOrganizerImageById,
    getOrganizerProfileById,
    postOrganizer,
}