const {  getProductReviewsByVisitor, getProductReview, putProductReview, getContent, putMarketReview, getMarketReview, getMarketBookmark, getMarketHistory, getVisitorVisitedMarket, getVisitors, getVisitorProfileById, postVisitor, putVisitor, deleteVisitorById, putVisitorById, putVisitorImageById } = require('../services/visitors')


const GetProductReviewsByVisitor = async (req, res) => {
    try {
        const { id: visitor_id } = req.params;
        const reviews = await getProductReviewsByVisitor(visitor_id);

        res.status(200).send(reviews);
    } catch (error) {
        res.status(500).send(error);
    }
}

// PUT /visitor/:visitor_id/product-review?id=review_id
const PutProductReview = async (req, res) => {
  try {
    const { id: review_id } = req.query;

    const { rating, review, image } = req.body;

    const data = await putProductReview(review_id, { rating, review, image });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(error);
  }
};

// GET /visitor/:visitor_id/product-review?id=review_id
const GetProductReview = async (req, res) => {
  try {
    const { id: visitor_id } = req.params;
    const { id: review_id } = req.query;
    let review;

    if (review_id) review = await getProductReview(visitor_id, review_id);
    else review = await getProductReviewsByVisitor(visitor_id);

    res.status(200).json(review);
  } catch (error) {
    res.status(500).send(error);
  }
};


const GetContent = async (req, res) => {
    try {
        const { id: visitor_id } = req.params;
        const contents = await getContent(visitor_id);

        res.status(200).json(contents);
    } catch (error) {
        res.status(500).send(error);
    }
}

const PutMarketReview = async (req, res) => {
  try {
    const { id: review_id } = req.query;

    const {
      rating,
      review,
      image // 👈 optional
    } = req.body;

    const data = await putMarketReview(
      review_id,
      { rating, review, image }
    );


    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(error);
  }
};


const GetMarketReview = async (req, res) => {
    try {
        const { id: visitor_id } = req.params;
        const { id: review_id } = req.query;
        const review = await getMarketReview(visitor_id, review_id);
        res.status(200).json(review);
    } catch (error) {
        res.status(500).send(error);
    }
}

const GetMarketBookmark = async (req, res) => {
    try {
        const { id: visitor_id } = req.params;
        const bookmark = await getMarketBookmark(visitor_id);
        res.status(200).json(bookmark);
    } catch (error) {
        res.status(500).send(error);
    }
}

const GetMarketHistory = async (req, res) => {
    try {
        const { id: visitor_id } = req.params;
        const history = await getMarketHistory(visitor_id);
        res.status(200).json(history);
    } catch (error) {
        res.status(500).send(error);
    }
}

const GetVisitors = async (req, res) => {
    try {
        const visitors = await getVisitors();
        res.status(200).json(visitors);
    }
    catch (err) {
    res.status(500).send(err)
    }
}

const GetVisitorProfileById = async (req, res) => {
    try {
        const id = req.params.id;
        const visitor = await getVisitorProfileById(id);
        res.status(200).json(visitor);
    }
    catch (err) {
        res.status(500).send(err)
    }
}

const PutVisitorImageById = async (req, res) => {
    try {
        const id = req.params.id;
        const { image } = req.body;
        const visitor = await putVisitorImageById(id, image);
        res.status(200).json(visitor); 
    } catch (err) {
        res.status(500).send(err)
    }
}
const PostVisitor = async (req, res) => {
    try {
        const data = req.body;
        const visitor = await postVisitor(data);
        res.status(200).json(visitor);
    }
    catch (err) {
        res.status(500).send(err)
    }

}

const PutVisitorById = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        const visitor = await putVisitorById(id, updates);
        res.status(200).json(visitor);
    }
    catch (err) {
        res.status(500).send(err)
    }
}

const DeleteVisitorById = async (req, res) => {
    try {
        const id = req.params.id;
        await deleteVisitorById(id);
        res.status(200).send("Successfully deleted")
    }
    catch (err) {
        res.status(500).send(err)
    }
}

const GetVisitorVisitedMarket = async (req, res) => {
    try {
        const id = req.params.id;
        const markets = await getVisitorVisitedMarket(id);
        res.status(200).json(markets);
    } catch (error) {
        res.status(500).send(error);
    }
}


module.exports = {
    GetProductReviewsByVisitor,
    PutProductReview,
    GetProductReview,
    GetContent,
    PutMarketReview,
    GetMarketReview,
    GetMarketBookmark,
    GetMarketHistory,
    GetVisitorVisitedMarket,
    PutVisitorImageById,
    GetVisitors,
    PostVisitor,
    GetVisitorProfileById,
    PutVisitorById,
    DeleteVisitorById
}