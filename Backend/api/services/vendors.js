const { supabase } = require('../../db')
const puppeteer = require('puppeteer');

const deleteVendor = async (vendor_id) => {
  const { data, error } = await supabase
    .from("vendor")
    .delete()
    .eq("id", vendor_id);
}

const putVerification = async (vendor_id, verified) => {

  const { data, error }= await supabase
    .from("vendor")
    .update({verified})
    .eq("id", vendor_id)
    .select()
    .single();


  return data;
}

const downloadStatistic = async (vendor_id) => {
  const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    const frontendReportUrl = `http://localhost:5173/business/vendor/${vendor_id}/statistic-download`;

  await page.goto(frontendReportUrl, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
  });

  await browser.close();

  return pdfBuffer;
}

const getVerification = async (vendor_id) => {
  const { data, error } = await supabase
    .from("vendor")
    .select("verified")
    .eq("id", vendor_id)
    .single();

  return data;
}
const getStatistic = async (vendor_id) => {
  const { data, error } = await supabase.rpc("get_vendor_statistic", {p_vendor_id: vendor_id}).single();

  return data;
}

const deleteMarketspaceApplication = async (application_id) => {
  const { data, error } = await supabase
    .from("space_applications")
    .delete()
    .eq("id", application_id);

}
const getMarketspaceApplication = async (vendor_id) => {
  const { data, error } = await supabase.rpc("get_marketspace_application_as_vendor", { p_vendor_id: vendor_id});

  return data;
}

const getVendors = async () => {
    const { data, error } = await supabase.from('vendor').select('*');

    return data;
};

const getVendorById = async (id) => {
    const { data, error } = await supabase.from('vendor').select('*').eq('id', id).single();

    return data;
};

const getVendorProfileById = async (id) => {
    const { data, error } = await supabase.rpc('get_business_profile', { user_id: id}).single();
    console.log(error);
    return data;
};

const putVendorProfileById = async (id, update) => {
    const { data, error } = await supabase.rpc('update_business_profile', {
        user_id: id,
        new_username: update.username,
        new_fullname: update.fullname,
        new_image: update.image
    }).single();

    return data;
}

const putVendorImageById = async (id, image) => {
    const { data, error} = await supabase
        .from('vendor')
        .update( {
            image
        })
        .eq('id', id)
        .select()
        .single();

    return data;
}

const postVendor = async (vendor) => {
  // 1️⃣ Insert vendor row
  const { data: vendorData, error: vendorError } = await supabase
    .from("vendor")
    .insert({
      id: vendor.user_id,
      name: vendor.businessName,
      license: vendor.businessLicense,
    })
    .select();

  if (vendorError) {
    console.error("Vendor insert error:", vendorError);
    return { error: vendorError };
  }

  // 2️⃣ Update visitor info
  const { data: visitorData, error: visitorError } = await supabase
    .from("visitor")
    .update({
      username: vendor.username,
      fullname: vendor.fullName,
      nric: vendor.nric,
    })
    .eq("id", vendor.user_id)
    .select();

  if (visitorError) {
    console.error("Visitor update error:", visitorError);
  }

  // 3️⃣ Create vendor folder in storage
  const folderPath = `vendors/${vendor.user_id}/`;

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

  // 5️⃣ Update vendor row with image path (folder link)
  const { data: updatedVendor, error: updateError } = await supabase
    .from("vendor")
    .update({ image: folderUrl })
    .eq("id", vendor.user_id)
    .select();

  if (updateError) {
    console.error("Failed to update vendor image path:", updateError);
  }

  return {
    vendorData: updatedVendor || vendorData,
    visitorData,
    folderUrl,
  };
};


const putVendorById = async (id, updates) => {

    const { data, error } = await supabase
        .from('vendor')
        .update({
            username: updates.username,
            fullname: updates.fullname,
            image: updates.image,
        })
        .eq('id', id)
        .select()
        .single();

    return data;
}

const deleteVendorById = async (id) => {
    const { error } = await supabase
        .from('vendor')
        .delete()
        .eq('id', id)
}


module.exports = {
  deleteVendor,
  putVerification,
  deleteMarketspaceApplication,
  downloadStatistic,
  getVerification,
  getStatistic,
    getMarketspaceApplication,
    putVendorImageById,
    putVendorProfileById,
    getVendorProfileById,
    getVendors,
    getVendorById,
    postVendor,
    putVendorById,
    deleteVendorById
};
