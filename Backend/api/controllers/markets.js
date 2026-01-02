const { getMarketspace, putMarket, deleteMarketSchedule, getMarketSchedule, postMarketSchedule, postMarketVisitor, getMarketVendors, getMarketRatings, getMarketReview, getMarketSpaceById, deleteMarketBookmarkById, postMarketBookmarkById, getMarketBookmarkById, deleteMarketLikeById, postMarketLikeById, getMarketLikeById, getMarkets, getMarketById, postMarket } = require('../services/markets')

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
        console.log(id);
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
    const visitor_id = req.query.visitor_id; 

    const market = await postMarketBookmarkById(market_id, visitor_id);
    res.status(200).json(market);
  } catch (err) {
    res.status(500).send(err);
  }
};

const DeleteMarketBookmarkById = async (req, res) => {
  try {
    const market_id = req.params.id;
    const visitor_id = req.query.visitor_id; 

    const market = await deleteMarketBookmarkById(market_id, visitor_id);
    res.status(200).json(market);
  } catch (err) {
    res.status(500).send(err);
  }
};




module.exports = {
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