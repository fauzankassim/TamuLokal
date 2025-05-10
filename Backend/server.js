const api = require('./api')
require("dotenv").config();



const port = process.env.PORT || '8080'
api.listen(port)