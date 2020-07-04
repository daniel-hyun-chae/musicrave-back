const dotenv = require("dotenv");
dotenv.config();

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;

module.exports = { client_id, client_secret, redirect_uri };
