"use strict";
const createAPI = require("lambda-api");
const { middify } = require("./middify");
const axios = require("axios");
const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("./utils/sendResponses");

const baseUrl = "/api/";
const api = createAPI({ base: baseUrl });

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

// get videos
api.get("/videos", async (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;

  try {
    const data = await instance
      .get(`/videos`, {
        params: {
          page: page || 1,
          limit: limit || 10,
        },
      })
      .then((res) => res.data);

    res.status(200).json(sendSuccessResponse(data));
  } catch (error) {
    console.log(error);
    res.status(500).json(sendErrorResponse(error?.response?.data?.message));
  }
});

api.get("/videos/:id", async (req, res) => {
  const id = req.params.id;

  // check required video id
  if (!id) {
    return res.status(400).json(sendErrorResponse("Bad request"));
  }

  try {
    const data = await instance.get(`/videos/${id}`).then((res) => res.data);

    res.status(200).json(sendSuccessResponse(data));
  } catch (error) {
    console.log(error);
    res.status(500).json(sendErrorResponse(error?.response?.data?.message));
  }
});

// obtain upload credentials
api.put(`/videos/`, async (req, res) => {
  const title = req.query.title;
  const folderId = req.query.folderId;

  // check title required
  if (!title || title.trim().length == 0) {
    return res.status(400).json(sendErrorResponse("Bad request"));
  }

  const params = {
    title,
    folderId,
  };

  try {
    // request credentials from vdo cipher
    const data = await instance
      .put(
        `/videos`,
        {},
        {
          params,
        }
      )
      .then((res) => res.data);

    res.status(200).json(sendSuccessResponse(data));
  } catch (error) {
    console.log(error);
    res.status(500).json(sendErrorResponse(error?.response?.data?.message));
  }
});

// get otp and playbackInfo by video id
api.post(`/videos/:id/otp`, async (req, res) => {
  const id = req.params.id;

  // video id required
  if (!id) {
    return res.status(400).json(sendErrorResponse("Bad request"));
  }

  try {
    // get otp from vdo cipher
    const data = await instance
      .post(`/videos/${id}/otp`, {
        ttl: 300,
      })
      .then((res) => res.data);

    res.status(200).json(sendSuccessResponse(data));
  } catch (error) {
    console.log(error);
    res.status(500).json(sendErrorResponse(error?.response?.data?.message));
  }
});

module.exports.api = middify((event, context) => api.run(event, context));
