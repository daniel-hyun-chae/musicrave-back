const router = require("express").Router();
const querystring = require("querystring");
const axios = require("axios");

const baseUrl = "https://api.spotify.com/v1/search";

router.post("/", async (req, res) => {
  const { type, q, market } = req.body;
  const requestUrl = `${baseUrl}?${querystring.stringify({
    q,
    type,
    market,
    limit: 50,
  })}`;
  const searchResult = await axios.get(requestUrl, {
    headers: { Authorization: `Bearer ${req.cookies.access_token}` },
  });
  res.status(200).json(searchResult.data);
});

module.exports = router;
