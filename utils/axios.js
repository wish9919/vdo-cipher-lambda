const axios = require("axios");

const VDO_API = "https://dev.vdocipher.com/api";
const API_SECRET = "Apisecret " + process.env.VDO_CIPHER_SECRET;

// axios instance
const instance = axios.create({
  baseURL: VDO_API,
});

instance.interceptors.request.use(
  function (config) {
    config.headers = {
      Accept: "application/json",
      Authorization: API_SECRET,
    };

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

module.exports = instance;
