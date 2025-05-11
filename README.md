# Spotify App Test

This project is a test application for integrating with the Spotify API.


## Requirements
- Node.js (v16 or higher)
- Spotify Developer Account

## Installation
1. Clone the repository:
  ```bash
  git clone https://github.com/Dhairya3124/spotify-app-test.git
  ```
2. Navigate to the project directory:
  ```bash
  cd spotify-app-test
  ```
3. Install dependencies:
  ```bash
  npm install
  ```

## Usage
1. Create a `.env` file in the root directory and add your Spotify API credentials:
  ```
  SPOTIFY_CLIENT_ID=your_client_id
  SPOTIFY_CLIENT_SECRET=your_client_secret
  SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
  ```
2. Start the development server:
  ```bash
  npm start
  ```
3. Open your browser and navigate to `http://localhost:3000`.


## API Endpoints
- `GET /login`: Redirects to Spotify for authentication.
- `GET /callback`: Handles the callback from Spotify after authentication.
- `GET /artists`: Fetches a list of followed artists.
- `GET /play`: Plays a random track from the user's library(Top 10).
- `GET /stop`: Pauses the current track.

## License
This project is licensed under the [MIT License](LICENSE).