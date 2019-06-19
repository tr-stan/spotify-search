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
const BASE_URL = 'https://api.spotify.com/v1/';
const REFRESH_RATE = 59000 * 60; // 59 minutes

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
        // the `auth` option is used for the BASIC auth header, but not for BEARER
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

app.get('/artists/:name', (request, response, next) => {
	let name = request.params.name;
	axios({
		url: `/search`,
		headers: { 'Authorization': `Bearer ${accessToken}`},
		baseURL: BASE_URL,
		params: {
			q: name,
			type: 'artist',
			limit: "10"
		}
	})
	.then(results => {
		console.log(results.data);
		response.send(results.data.artists);
	})
	.catch(error => {
		console.log("There was an error fetching the artists", error);
	})
})

app.get('/artists/:id/top-tracks', (request, response, next) => {
	let id = request.params.id;
	axios({
		url: `/artists/${id}/top-tracks`,
		headers: { 'Authorization': `Bearer ${accessToken}`},
		baseURL: BASE_URL,
		params: {
			country: 'US'
		}
	})
	.then(results => {
		console.log(results.data);
		response.send(results.data);
	})
	.catch(error => {
		console.log("There was an error fetching the artists", error);
	})
})

app.get('/tracks/:name', (request, response, next) => {
	let name = request.params.name;
	axios({
		url: `/search`,
		headers: { 'Authorization': `Bearer ${accessToken}`},
		baseURL: BASE_URL,
		params: {
			q: name,
			type: 'track',
			limit: "10"
		}
	})
	.then(results => {
		console.log(results.data);
		response.send(results.data);
	})
	.catch(error => {
		console.log("There was an error fetching the artists", error);
	})
})

app.get('/any/:name', (request, response, next) => {
	let name = request.params.name;
	axios({
		url: `/search`,
		headers: { 'Authorization': `Bearer ${accessToken}`},
		baseURL: BASE_URL,
		params: {
			q: name,
			type: 'track,artist,album',
			limit: "10"
		}
	})
	.then(results => {
		console.log(results.data);
		response.send(results.data);
	})
	.catch(error => {
		console.log("There was an error fetching the artists", error);
	})
})

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