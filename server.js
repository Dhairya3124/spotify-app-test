require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const SpotifyWebAPI = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebAPI({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI
});

app.get('/spotify', (req, res) => {
  res.send('Welcome to Spotify Menu');
});
app.get('/login', (req, res) => {
  // Define the scopes for authorization; these are the permissions we ask from the user.
  const scopes = [
    'user-read-private',
    'user-read-email',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-follow-read',
    'user-top-read'
  ];
  // Redirect the client to Spotify's authorization page with the defined scopes.
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
});
app.get('/callback', (req, res) => {
  // Extract the error, code, and state from the query parameters.
  const error = req.query.error;
  const code = req.query.code;

  // If there is an error, log it and send a response to the user.
  if (error) {
    console.error('Callback Error:', error);
    res.send(`Callback Error: ${error}`);
    return;
  }

  // Exchange the code for an access token and a refresh token.
  spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
      const accessToken = data.body['access_token'];
      const refreshToken = data.body['refresh_token'];
      const expiresIn = data.body['expires_in'];

      // Set the access token and refresh token on the Spotify API object.
      spotifyApi.setAccessToken(accessToken);
      spotifyApi.setRefreshToken(refreshToken);

      // Logging tokens can be a security risk; this should be avoided in production.
      console.log('The access token is ' + accessToken);
      console.log('The refresh token is ' + refreshToken);

      // Send a success message to the user.
      res.send(
        'Login successful! You can now use the /search and /play endpoints.'
      );

      // Refresh the access token periodically before it expires.
      setInterval(async () => {
        const data = await spotifyApi.refreshAccessToken();
        const accessTokenRefreshed = data.body['access_token'];
        spotifyApi.setAccessToken(accessTokenRefreshed);
      }, (expiresIn / 20) * 10000); // Refresh halfway before expiration.
    })
    .catch(error => {
      console.error('Error getting Tokens:', error);
      res.send('Error getting tokens');
    });
});

// Get top Artists
app.get('/artists', async (req, res) => {
  try {
    const data = await spotifyApi.getFollowedArtists();
    let topArtists = [];
    for (let i = 0; i < data.body.artists.items.length; i++) {
      topArtists[i] = data.body.artists.items[i].name;
    }
    res.send(topArtists);
  } catch (error) {
    console.error('Error fetching followed artists:', error);
    res.status(500).send('Error fetching followed artists');
  }
});
// Stopping current playing song
app.get('/stop', async (req, res) => {
  try {
    const data = await spotifyApi.pause();
    res.send(data.body);
  } catch (error) {
    console.error('Error pausing song:', error);
    res.status(500).send('Error pausing song');
  }
});
// Getting Top 10 tracks and playing randomly one.
app.get('/play', async (req, res) => {
  try {
    const data = await spotifyApi.getMyTopTracks();
    let topTracks = [];

    for (let i = 0; i < 10; i++) {
      let trackObject = {};
      trackObject.name = data.body.items[i].name;
      trackObject.uri = data.body.items[i].uri;
      topTracks[i] = trackObject;
    }
    const randomIndex = Math.floor(Math.random() * topTracks.length);
    await spotifyApi.play({ uris: [topTracks[randomIndex].uri] });
    res.send(topTracks);
  } catch (error) {
    console.error('Error playing song:', error);
    res.status(500).send('Error playing song');
  }
});

app.listen(port, () => console.log(`Spotify app listening on port ${port}!`));
