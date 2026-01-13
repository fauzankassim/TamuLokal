const { putVerification, deleteMarket, putMarketReview, getVerification, putMarketImage, deleteMarketspace, downloadMarketStatistic, postMarketClick, postMarketspace, getMarketAdmin, getMarketStatistic, postMarketReview, getMarketspace, putMarket, deleteMarketSchedule, getMarketSchedule, postMarketSchedule, postMarketVisitor, getMarketVendors, getMarketRatings, getMarketReview, getMarketSpaceById, deleteMarketBookmarkById, postMarketBookmarkById, getMarketBookmarkById, deleteMarketLikeById, postMarketLikeById, getMarketLikeById, getMarkets, getMarketById, postMarket } = require('../services/markets')


const PutVerification = async (req, res) => {
  try {
    const { id: market_id } = req.params;
    const { status } = req.query;

    const verification = await putVerification(market_id, status);
    res.status(200).json(verification);
  } catch (error) {
    res.status(500).send(error);
  }
}
const DeleteMarket = async (req, res) => {
  try {
    const { id: market_id } = req.params;
    const market = await deleteMarket(market_id);
    res.status(200).json(market);
  } catch (error) {
    res.status(500).send(error);
  }
}

const PutMarketReview = async (req, res) => {
    try {
        const { id: market_id } = req.params;
        const { id: review_id } = req.query;
        const data = req.body;
        const review = await putMarketReview(market_id, review_id, data);
        res.status(200).json(review);
    } catch (error) {
        res.status(500).send(error);
    }
}
const GetVerification = async (req, res) => {
  try {
    const { id: market_id } = req.params;
    const { organizer_id } = req.query;
    const verification = await getVerification(market_id, organizer_id);
    res.status(200).json(verification);
  } catch (error) {
    res.status(500).send(error);
  }
}

const PutMarketImage = async (req, res) => {
  try {
    const { id: market_id } = req.params;
    const { image } = req.body;
    const market = await putMarketImage(market_id, image);
    res.status(200).json(market);
  } catch (error) {
    res.status(500).send(error)
  }
}

const DeleteMarketspace = async (req, res) => {
  try {
    const { space_id } = req.query;
    const space = await deleteMarketspace(space_id);
    res.status(200).json(space);
  } catch (error) {
    res.status(500).send(error);
  }

}
const DownloadMarketStatistic = async (req, res) => {
  const { id: market_id } = req.params;
  try {
    // Generate PDF buffer from service
    const pdfBuffer = await downloadMarketStatistic(market_id);

    // Set headers for download
    const filename = `market-statistic.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    res.send(pdfBuffer);
  } catch (err) {
    console.error('[DownloadMarketStatistic]', err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
}

const PostMarketClick = async (req, res) => {
  try {
    const { id: market_id } = req.params;
    const { viewer_id } = req.body;
    const click = await postMarketClick(viewer_id, market_id);
    res.status(200).json(click);
  } catch (error) { 
    res.status(500).send(error);
  }
}

const PostMarketspace = async (req, res) => {
  try {
    const spaces = req.body;
    const marketspaces = await postMarketspace(spaces);
    res.status(200).json(marketspaces);
  } catch (error) {
    res.status(500).send(error);
  }
}

const GetMarketAdmin = async (req, res) => {
  try {
    const markets = await getMarketAdmin();
    res.status(200).json(markets);
  } catch (errror) {
    res.status(500).send(error);
  }
}
const GetMarketStatistic = async (req, res) => {
  try {
    const { id: market_id } = req.params;
    const statistic = await getMarketStatistic(market_id);
    res.status(200).json(statistic);
  } catch (error) {
    res.status(500).send(error);
  }
}

const PostMarketReview = async (req, res) => {
  try {
    const { id: market_id } = req.params;
    const { visitor_id, rating, review } = req.body;
    const data = await postMarketReview(market_id, visitor_id, rating, review);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(error);
  }
}

const GetMarketspace = async (req, res) => {
    try {
        const { id: market_id } = req.params;
        const marketspace = await getMarketspace(market_id);
        res.status(200).json(marketspace);
    } catch (error) {
        res.status(500).send(error);
    }  
}

const DeleteMarketSchedule = async (req, res) => {
  try {
    const { id: market_id } = req.params;
    const schedules = await deleteMarketSchedule(market_id);
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).send(error);
  }
}

const GetMarketSchedule = async (req, res) => {
  try {
    const { id: market_id } = req.params;
    const schedules = await getMarketSchedule(market_id);
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).send(error);
  }
}

const PostMarketSchedule = async (req, res) => {
  try {
    const { id: market_id } = req.params;
    const { schedules } = req.body;
    const schedule = await postMarketSchedule(market_id, schedules);
    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).send(error);
  }
}

const PostMarketVisitor = async (req, res) => {
  try {
    const { visitor_id } = req.body;
    const market_id = req.params.id;

    const visit = await postMarketVisitor(visitor_id, market_id);
    res.status(200).json(visit);
  } catch (error) {
    res.status(500).send(error);
  }
}

const GetMarkets = async (req, res) => {
  try {
    const { user_latitude, user_longitude, limit } = req.query;
    
    // Convert query parameters to numbers if provided
    const lat = user_latitude ? parseFloat(user_latitude) : null;
    const lng = user_longitude ? parseFloat(user_longitude) : null;

    const markets = await getMarkets(lat, lng, limit);
    res.status(200).json(markets);
  }
  catch (err) {
    res.status(500).send(err.message);
  }
}


const GetMarketVendors = async (req, res) => {
  try {
    const id = req.params.id;
    const vendors = await getMarketVendors(id);
    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).send(error);
  }
}
const GetMarketRatings = async (req, res) => {
  try {
    const id = req.params.id;
    const ratings = await getMarketRatings(id);
    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).send(error);
  }
}
const GetMarketReview = async (req, res) => {
  try { 
    const id = req.params.id;
    const reviews = await getMarketReview(id);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).send(error);
  }
}



const GetMarketSpaceById = async (req, res) => {
    try {
        const id = req.params.id;
        const spaces = await getMarketSpaceById(id);
        res.status(200).json(spaces);

    } catch (err) {
        res.status(500).jend(err)
    }
}




const GetMarketById = async (req, res) => {
    try {
        const id = req.params.id;
        const market = await getMarketById(id);
        res.status(200).json(market);
    }
    catch (err) {
    res.status(500).send(err)
    }
}

const PostMarket = async (req, res) => {
    try {
        const data = req.body;
        const market = await postMarket(data);
        res.status(200).json(market);
    }
    catch (err) {
        res.status(500).send(err)
    }

}

const PutMarket = async (req, res) => {
    try {
        const data = req.body;
        const { id: market_id } = req.params; 
        const market = await putMarket(market_id, data);
        res.status(200).json(market);
    }
    catch (err) {
        res.status(500).send(err)
    }

}

const GetMarketLikeById = async (req, res) => {
  try {
    const market_id = req.params.id;
    const visitor_id = req.query.visitor_id; 

    const market = await getMarketLikeById(market_id, visitor_id);
    res.status(200).json(market);
  } catch (err) {
    res.status(500).send(err);
  }
};

const PostMarketLikeById = async (req, res) => {
  try {
    const market_id = req.params.id;
    const visitor_id = req.query.visitor_id; 

    const market = await postMarketLikeById(market_id, visitor_id);
    res.status(200).json(market);
  } catch (err) {
    res.status(500).send(err);
  }
};

const DeleteMarketLikeById = async (req, res) => {
  try {
    const market_id = req.params.id;
    const visitor_id = req.query.visitor_id; 

    const market = await deleteMarketLikeById(market_id, visitor_id);
    res.status(200).json(market);
  } catch (err) {
    res.status(500).send(err);
  }
};


const GetMarketBookmarkById = async (req, res) => {
  try {
    const market_id = req.params.id;
    const visitor_id = req.query.visitor_id; 

    const market = await getMarketBookmarkById(market_id, visitor_id);

    res.status(200).json(market);
  } catch (err) {
    res.status(500).send(err);
  }
};

const PostMarketBookmarkById = async (req, res) => {
  try {
    const market_id = req.params.id;
    const { visitor_id }= req.body;

    const market = await postMarketBookmarkById(market_id, visitor_id);
    res.status(200).json(market);
  } catch (err) {
    res.status(500).send(err);
  }
};

const DeleteMarketBookmarkById = async (req, res) => {
  try {
    const market_id = req.params.id;
    const { visitor_id }= req.body;

    const market = await deleteMarketBookmarkById(market_id, visitor_id);
    res.status(200).json(market);
  } catch (err) {
    res.status(500).send(err);
  }
};




module.exports = {
  PutVerification,
  DeleteMarket,
  PutMarketReview,
GetVerification,
  PutMarketImage,
  DeleteMarketspace,
  DownloadMarketStatistic,
  PostMarketClick,
  PostMarketspace,
  GetMarketAdmin,
  GetMarketStatistic,
  PostMarketReview,
  GetMarketspace,
  PutMarket,
  DeleteMarketSchedule,
  GetMarketSchedule,
  PostMarketSchedule,
  PostMarketVisitor,
  GetMarketVendors,
  GetMarketRatings,
  GetMarketReview,
    GetMarketSpaceById,
    DeleteMarketBookmarkById,
    PostMarketBookmarkById,
    GetMarketBookmarkById,
    DeleteMarketLikeById,
    PostMarketLikeById,
    GetMarketLikeById,
    GetMarkets,
    GetMarketById,
    PostMarket
}