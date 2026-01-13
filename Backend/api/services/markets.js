const puppeteer = require('puppeteer');
const { supabase } = require('../../db');

const deleteMarket = async (market_id) => {
  const { data, error } = await supabase
    .from("market")
    .delete()
    .eq("id", market_id);

    console.log(error);
}

const putMarketReview = async (market_id, review_id, review) => {
    const { data, error } = await supabase
        .from("market_review")
        .update(review)
        .eq("market_id", market_id)
        .eq("id", review_id)
        .single();

    return data;
}

const putVerification = async(market_id, status) => {
  const { data, error } = await supabase
    .from("market_applications")
    .update({status})
    .eq("market_id", market_id)
    .single();

  return data;
}

const getVerification = async (market_id, organizer_id) => {
  const { data, error } = await supabase
    .from("market_applications")
    .select("status")
    .eq("market_id", market_id)
    .eq("organizer_id", organizer_id)
    .single();

  return data;
}

const downloadMarketStatistic = async (market_id) => {
  const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    const frontendReportUrl = `${process.env.FRONTEND}/business/market/${market_id}/statistic-download`;

  await page.goto(frontendReportUrl, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
  });

  await browser.close();

  return pdfBuffer;
}
const postMarketClick = async (viewer_id, market_id) => {
  const { data, error } = await supabase
    .from("market_click")
    .insert({viewer_id, market_id})
}
const postMarketspace = async (marketspaces) => {

  const { data, error } = await supabase
    .from("space")
    .insert(marketspaces)
    .select();


  return data;
}

const deleteMarketspace = async (space_id) => {
  const { data, error } = await supabase
    .from("space")
    .delete()
    .eq("id", space_id);

    console.log(error);

}

const getMarketAdmin = async () => {
  const { data, error } = await supabase.rpc("get_markets_as_admin");

  return data;
}

const getMarketStatistic = async (market_id) => {
  const { data, error } = await supabase
    .rpc("get_market_statistic", {
      p_market_id: market_id
    })
    .single();

  return data;
}
const postMarketReview = async (market_id, visitor_id, rating, review) => {
  const { data, error } = await supabase
    .from("market_review")
    .insert({
      market_id,
      visitor_id,
      review,
      rating
    })
    .select()
    .single();

  

  return data;
}

const getMarketspace = async (market_id) => {
  const { data, error } = await supabase
    .rpc("get_marketspace_as_organizer", 
      {p_market_id: market_id}
    );

  return data;  
}
const deleteMarketSchedule = async (market_id) => {
  const { data, error } = await supabase
    .from("market_schedule")
    .delete()
    .eq("market_id", market_id);

  return data;
}
const getMarketSchedule = async (market_id) => {
  const { data, error } = await supabase
    .from("market_schedule")
    .select("*")
    .eq('market_id', market_id);

  return data;
}

const postMarketSchedule = async (market_id, schedules) => {
  const { data, error } = await supabase
    .from("market_schedule")
    .insert(schedules)
    .select()

  return data;
}

const getMarkets = async (user_latitude = null, user_longitude = null, limit = null) => {
    const { data, error } = await supabase
      .rpc('get_all_markets', {
        user_latitude,
        user_longitude
      })
      .limit(limit);
    

    if (error) throw error;
    return data;
};


const getMarketById = async (id) => {
    const { data, error } = await supabase.rpc('get_market', { p_market_id: id }).single();
    return data;
};

const postMarket = async (newMarket) => {
  // Step 1: Insert the new market row
  const { data, error } = await supabase
    .rpc("post_market", {
      p_organizer_id: newMarket.organizer_id,
      p_name: newMarket.name,
      p_description: newMarket.description,
      p_address: newMarket.address,
      p_recurrence_type: newMarket.recurrence_type, // Changed from p_frequency
      p_latitude: newMarket.latitude,
      p_longitude: newMarket.longitude,
      p_start_date: newMarket.start_date, // Added new parameter
    })
    .select()
    .single(); // get one row instead of array

  if (error) {
    console.error("Error creating market:", error);
    throw error;
  }
  
  return data;
};

const putMarketImage = async (market_id, image) => {
  const { data, error } = await supabase
    .from("market")
    .update({image})
    .eq("id", market_id)

  return data;
}
const putMarket = async (market_id, market) => {
  // Step 1: Insert the new market row
  const { data, error } = await supabase
    .rpc("update_market", {
      p_market_id: market_id,
      p_organizer_id: market.organizer_id,
      p_name: market.name,
      p_description: market.description,
      p_address: market.address,
      p_recurrence_type: market.recurrence_type, // Changed from p_frequency
      p_latitude: market.latitude,
      p_longitude: market.longitude,
      p_start_date: market.start_date, // Added new parameter
    })
    .select()
    .single(); // get one row instead of array

  if (error) {
    console.error("Error creating market:", error);
    throw error;
  }
  
  return data;
};
const getMarketLikeById = async (market_id, visitor_id) => {
  // ✅ Get total like count
  const { count, error: countError } = await supabase
    .from('market_like')
    .select('*', { count: 'exact', head: true })
    .eq('market_id', market_id);

  if (countError) {
    console.error("Error fetching like count:", countError);
    return { count: 0, hasLiked: false };
  }

  // ✅ Check if this visitor already liked
  const { data: likedData, error: likedError } = await supabase
    .from('market_like')
    .select('*')
    .eq('market_id', market_id)
    .eq('visitor_id', visitor_id)
    .maybeSingle(); // safer than .single() in case there's no match

  if (likedError) {
    console.error("Error checking if liked:", likedError);
  }

  const hasLiked = !!likedData;

  return { count: count ?? 0, hasLiked };
};

const postMarketLikeById = async (market_id, visitor_id) => {
  // Insert like
  const { error: insertError } = await supabase
    .from('market_like')
    .insert({ visitor_id, market_id });

  if (insertError) throw insertError;

  // Get updated count
  const { count, error: countError } = await supabase
    .from('market_like')
    .select('*', { count: 'exact', head: true })
    .eq('market_id', market_id);

  if (countError) throw countError;

  return {
    count,
    hasLiked: true,
  };
};


const deleteMarketLikeById = async (market_id, visitor_id) => {
  // Delete the like
  const { error: deleteError } = await supabase
    .from('market_like')
    .delete()
    .eq('visitor_id', visitor_id)
    .eq('market_id', market_id);

  if (deleteError) throw deleteError;

  // Get updated count
  const { count, error: countError } = await supabase
    .from('market_like')
    .select('*', { count: 'exact', head: true })
    .eq('market_id', market_id);

  if (countError) throw countError;

  return {
    count,
    hasLiked: false,
  };
};


const getMarketBookmarkById = async (market_id, visitor_id) => {

  const { data, error} = await supabase
    .from("market_bookmark")
    .select("*")
    .eq("market_id", market_id)
    .eq("visitor_id", visitor_id);

  if (data.length > 0) return { hasBookmarked: true };
  else return { hasBookmarked: false }; 
};

const postMarketBookmarkById = async (market_id, visitor_id) => {

  const { data, error} = await supabase
    .from("market_bookmark")
    .insert({
      visitor_id,
      market_id
    })
    .select()
    .single();

  return data;
};

const deleteMarketBookmarkById = async (market_id, visitor_id) => {
  const { data, error } = await supabase
    .from("market_bookmark")
    .delete()
    .eq("market_id", market_id)
    .eq("visitor_id", visitor_id);

  return data;
}




const getMarketSpaceById = async (id) => {

  const { data, error } = await supabase
    .from('space')
    .select('*')
    .eq('market_id', id)
    .is('vendor_id', null);

  return data;
}

const getMarketReview = async(id) => {
  const { data, error } = await supabase.rpc("get_market_reviews",{ p_market_id: id});

  return data;
}


const getMarketRatings = async(id) => {
  const { data, error } = await supabase.rpc("get_market_ratings", { p_market_id: id}).single();

  return data;
}

const getMarketVendors = async (id) => {
  const { data, error } = await supabase.rpc("get_market_vendors", { p_market_id: id});


  return data;
}

const postMarketVisitor = async (visitor_id, market_id) => {
  const { data, error } = await supabase
    .from("market_history")
    .insert([{
      visitor_id,
      market_id
    }])
    .select()
    .single();


  return data;
}

module.exports = {
  putVerification,
  deleteMarket,
  putMarketReview,
  getVerification,
  putMarketImage,
  deleteMarketspace,
  downloadMarketStatistic,
  postMarketClick,
  postMarketspace,
  getMarketAdmin,
  getMarketStatistic,
  postMarketReview,
  getMarketspace,
  putMarket,
  deleteMarketSchedule,
  getMarketSchedule,
  postMarketSchedule,
  postMarketVisitor,
  getMarketVendors,
  getMarketRatings,
  getMarketReview,
  getMarketSpaceById,
  deleteMarketBookmarkById,
  postMarketBookmarkById,
  getMarketBookmarkById,
  deleteMarketLikeById,
  postMarketLikeById,
  getMarketLikeById,
  getMarkets,
  getMarketById,
  postMarket,
};
