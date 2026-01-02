const api = require('./api')
require("dotenv").config();

const port = process.env.PORT || '8080'
api.listen(port, "10.115.126.21" || "localhost" ,() => {
  console.log(`Listening to requests on http://localhost:${port}`);
});