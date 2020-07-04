const router = require("express").Router();
const axios = require("axios");

const baseUrl = "https://api.spotify.com/v1";

router.get("/me", async (req, res) => {
  const myProfile = await axios.get(`${baseUrl}/me`, {
    headers: { Authorization: `Bearer ${req.cookies.access_token}` },
  });
  res.json(myProfile.data);
});

module.exports = router;
