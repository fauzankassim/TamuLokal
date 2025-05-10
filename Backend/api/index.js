const express = require('express')
const api = express()

api.use(express.json());
api.use('/api/visitor', require('./routes/visitors'))

module.exports = api