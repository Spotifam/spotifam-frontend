import React, { Component } from 'react';
import './DisplaySong.css';

// Code based off tutorial at 
// https://medium.com/@jonnykalambay/now-playing-using-spotifys-awesome-api-with-react-7db8173a7b13

import SpotifyWebApi from 'spotify-web-api-js'; // use spotify web api js wrapper
const spotifyApi = new SpotifyWebApi();

class App extends Component{
  constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: {
        name: 'Have not checked currently playing',
        albumArt: ''
      }
    }
  }
  
  // From spotify authentification repo
  // Obtains parameters from the hash of the URL
  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  getNowPlaying(){
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        this.setState({
          nowPlaying: { 
              name: response.item.name, 
              albumArt: response.item.album.images[0].url
            }
        });
      })
  }

  render(){
    this.getNowPlaying();
    return{
      <div className = "App">
        <div> 
          Now Playing: { this.state.nowPlaying.name }
        </div>
        <div>
          <img src={ this.state.nowPlaying.albumArt } style = {{width: 300, height: 300}}/>
        </div>
      </div>
    }
  }
}

export default DisplaySong;
