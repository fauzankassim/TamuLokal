const {  getMarketBookmark, getMarketHistory, getVisitorVisitedMarket, getVisitors, getVisitorProfileById, postVisitor, putVisitor, deleteVisitorById, putVisitorById, putVisitorImageById } = require('../services/visitors')

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
        console.log(visitor);
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