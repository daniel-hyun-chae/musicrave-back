const router = require('express').Router();
const querystring = require('querystring');
const axios = require('axios');
const { generateRandomString } = require('../utils/login');
const { client_id, client_secret, redirect_uri } = require('../utils/config');

const stateKey = 'spotify_auth_state';

router.get('/login', function (req, res) {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  const scope = 'user-read-private user-read-email';
  res.redirect(
    'https://accounts.spotify.com/authorize?' +
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

router.get('/callback', async (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      '/#' +
        querystring.stringify({
          error: 'state_mismatch',
        })
    );
  } else {
    try {
      res.clearCookie(stateKey);

      const response = await axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        params: {
          grant_type: 'authorization_code',
          code,
          redirect_uri,
          client_id,
          client_secret,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.status === 200) {
        res.cookie('access_token', response.data.access_token, {
          httpOnly: true,
          sameSite: true,
          maxAge: response.data.expires_in * 1000,
        });
        res.cookie('refresh_token', response.data.refresh_token, {
          httpOnly: true,
          sameSite: true,
          maxAge: response.data.expires_in * 1000,
        });
        res.cookie('isLoggedIn', true, { sameSite: true });
      }

      res.redirect('http://localhost:3001');
    } catch (err) {
      res.redirect(
        '/#' +
          querystring.stringify({
            error: 'invalid_token',
          })
      );
    }
  }
});

module.exports = router;
