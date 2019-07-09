# Spotify Search
This Node.JS application can be used to fetch the Spotify Web API for Artist and Track data to use in a frontend application. It uses the Client Credentials auth flow, so users do not have to login or provide permissions through their own Spotify account.

You can use this API to search for tracks, artists, and artists' top 10 songs via Spotify's Web API. The data you receive will be in JSON format.



## How to set up the API

You can clone this repository to your local device by opening up your terminal and typing the commands:

*   `mkdir spotify-search && cd spotify-search`
*   `npm install`
*   `git clone https://github.com/tr-stan/spotify-search.git`

Then you will need to create a dotenv (`.env`) file:

*   `touch .env`

In this `.env` file, you will need to declare three environment variables. As you will see in the `index.js` file, there are three variables defined starting with `process.env`. Those you will need to define in your `.env` file such as:

*   `CLIENT_ID=AbCd1234Efg90xYZ`
*   `CLIENT_SECRET=123foUr567eIGht9tEn`
*   `PORT=4321`

( Don't forget to add your `.env` file to youre `.gitignore` file: `echo .env >> .gitignore`)

In order to get the `CLIENT_ID` and `CLIENT_SECRET` data, you will need to [login to Spotify's developer site](https://developer.spotify.com/dashboard/login) and register a new app. It's a quick and easy process, so please don't be deterred by this step!

If you need any help figuring out how to register/set up your app, you can [see Spotify's App Setting Guide](https://developer.spotify.com/documentation/general/guides/app-settings/).

Now if you use the command `npm run dev` your server should start up with nodemon at 'http://localhost:9000' or 'http://localhost:' + whatever you made your port in your `.env` file.


## Using the API



### Quick note on your search queries

Please note that your searches must be UTF-8 encoded.

You can use the ECMAScript `encodeURI()` built-in object method to encode your search

i.e. `encodeURI("Little Dragon")` => "Little%20Dragon", `encodeURI("Rock With You")` => "Rock%20With%20You"

I set my port in my `.env` file as `PORT=4321`, so I will be using `http://localhost:4321` as my base URL for all my fetch requests.


### To search for a track

This will return a list of 10 items that most closely match your search.
Send a fetch request to `http://localhost:4321/tracks/:trackName`

Example cURL request for Michael Jackson's "Rock With You"

: `curl 'http://localhost:4321/tracks/rock%20with%20you'`

### To search for an artist

This will return a list of 10 items that most closely match your search.
Send a fetch request to `http://localhost:4321/artists/:artistName`

Example cURL request for "Little Dragon"

: `curl 'http://localhost:4321/artists/Little%20Dragon'`



### To search for an artist's top ten tracks

This fetch requires you to know the specific artist's Spotify ID, which you can get from the previous request (/artists/:artistName).

Send a fetch request to `http://localhost:4321/artistID/top-tracks`

Example cURL request for Little Dragon's top ten tracks in Spotify

: `curl 'http://localhost:4321/6Tyzp9KzpiZ04DABQoedps/top-tracks'`

