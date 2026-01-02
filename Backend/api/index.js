const express = require('express');
const cors = require('cors');

const api = express();

api.use(express.json());

api.use(cors({
  origin: '*', 
  credentials: true,               
}));

api.use('/v1/visitor', require('./routes/visitors'));
api.use('/v1/market', require('./routes/markets'));
api.use('/v1/auth', require('./routes/auth'));
api.use('/v1/vendor', require('./routes/vendors'));
api.use('/v1/organizer', require('./routes/organizers'));
api.use('/v1/product', require('./routes/products'));
api.use('/v1/user', require('./routes/users'));
api.use('/v1/static', require('./routes/statics'));
api.use('/v1/marketspace', require('./routes/marketspaces'));
api.use('/v1/marketownership', require('./routes/marketownerships'));
api.use('/v1/content', require('./routes/contents'));
api.use('/v1/category', require('./routes/categories'));
api.use('/v1/notification', require('./routes/notifications'));


module.exports = api;
