const express = require('express')
const api = express()
api.use('/api/visitors', require('./routes/visitors'))

module.exports = api