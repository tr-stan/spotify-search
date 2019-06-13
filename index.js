require('dotenv').config();
const app = require('express')();
const axios = require('axios');
const cors = require('cors');
const base64 = require('base-64');
const LimitingMiddleware = require('limiting-middleware');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const PORT = process.env.PORT || 9000;

const AUTHORIZATION_HEADER = base64.encode(`${CLIENT_ID}:${CLIENT_SECRET}`);
const BASE_URL = 'https://api.spotify.com/v1/search';
const REFRESH_RATE = 59000 * 60;

// use cors middleware to allow requests from other servers/sites e.g. frontend application
app.use(cors());
// middleware for rate limiting with each request
app.use(new LimitingMiddleware().limitByIp());

let accessToken = ''

function requestToken() {
    axios({
            url: '/token',
            method: 'post',
            baseURL: 'https://accounts.spotify.com/api/',
            auth: {
                username: CLIENT_ID,
                password: CLIENT_SECRET
            },
            params: { grant_type: "client_credentials" }
        })
        .then(response => {
            accessToken = response.data.access_token;
            console.log(response.data);
        })
        .catch(error => {
            console.log('There was an error: ', error.message);
        })
}
requestToken();

setInterval(() => requestToken(), REFRESH_RATE)

app.get('/', (request, response) => {
    response.send('At your disposal. Try /artist/:name to search for an artist');
});

// super basic error handling middleware
app.use((error, req, res, next) => {
    res.status(error.statusCode).json({
        type: 'error',
        message: error.message
    });
});

app.listen(PORT, () => {
    console.log(`CORS-enabled server, listening on port ${PORT}!`);
});