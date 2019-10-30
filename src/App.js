/*
  <App/>

  Description:
    - <App/> is the root component of Spotifam's website

  Props:
    - <App/> does not have any props

  Child Components
    - LandingPage: initial page user sees when they come to the website
    - PlayerPage: page user sees when they are listening to music
*/


import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// routing
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

// components
import LandingPage from './Components/LandingPage/LandingPage.js';
import PlayerPage from './Components/PlayerPage/PlayerPage.js';

// Spotify
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyAPI = new SpotifyWebApi();

// =============================================================================
// Constants
// =============================================================================

let __pages = ['landing', 'webplayer']; // pages that the user can be on


// =============================================================================
// <App/>
// =============================================================================

class App extends Component {

  constructor() {
    super();

    // initialize Spotify API from access token handed through URL
    const urlParams = this.getURLParameters();
    const accessToken = urlParams.access_token;
    if (accessToken) {
      spotifyAPI.setAccessToken(accessToken);
    }


    this.state = {
      userLoggedIn: accessToken ? true : false
    }
  }


  // looks at parameters in the webpage URL and decodes it into a dict
  getURLParameters() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }


  // onClick -------------------------------------------------------------------
  /*
     onClick and onInput functions that modify App.state
  */

  onClick_loginToSpotify = () => {
    window.open('http://localhost:8888', "_self");
  }

  // render --------------------------------------------------------------------

  // returns the currently selected page (landing, webplayer, etc)
  renderPlayerPage = () => {
   if (this.state.userLoggedIn) {
     return (
       <PlayerPage
         spotifyAPI={spotifyAPI}
       />
     );
    } else {
      return (
        <LandingPage
          onClick_loginToSpotify={this.onClick_loginToSpotify}
        />
      );
    }
  }

  // renders the room page for users who want to access the queue via a room
  renderRoomPage = () => {
    return (
      <div>
        <h1>mobile!</h1>
      </div>
    );
  }

  // renders <App/>
  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route path="/room">
              {this.renderRoomPage()}
            </Route>

            <Route path="/">
              {this.renderPlayerPage()}
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
