const router = require('express').Router();
const querystring = require('querystring');
const axios = require('axios');

const baseUrl = 'https://api.spotify.com/v1/search';

router.get('/search', async (req, res) => {
  const myProfile = await axios.get(`${baseUrl}/me`, {
    headers: { Authorization: `Bearer ${req.cookies.access_token}` },
  });
  res.json(myProfile.data);
});

router.get('', function (req, res) {
  axios.get(
    baseUrl +
      querystring.stringify({
        response_type: 'code',
        client_id,
        scope,
        redirect_uri,
        state,
        show_dialog: true,
      })
  );
});

module.exports = router;
