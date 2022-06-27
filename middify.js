const middy = require("@middy/core");
const jsonBodyParser = require("@middy/http-json-body-parser");
const cors = require("@middy/http-cors");

const middify = (handler) => {
  return middy(handler).use(jsonBodyParser()).use(cors());
};

module.exports = { middify };
