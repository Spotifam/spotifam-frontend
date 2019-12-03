/*
  <App/>

  Description:
    - <App/> is the root component of Spotifam's website

  Props:
    - <App/> does not have any props

  Child Components
    - LandingPage:        initial page user sees when they come to the website
    - PlayerPage:         page user sees when they are listening to music
    - MobileOptionPage:   page for mobile users to select whether to join or create a room
            - SelectRoomPage:     page for mobile users to select a room
    - RoomPage:           page where users can add songs to the room's queue
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
import MobileOptionPage from './Components/MobileOptionPage/MobileOptionPage.js';
import RoomPage from './Components/RoomPage/RoomPage.js';


// Room Object
import SpotifamAPI from './SpotifamAPI.js';

// Spotify
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyAPI = new SpotifyWebApi();
const spotifamAPI = new SpotifamAPI();

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
      spotifamAPI.setAuthCode(accessToken);
    }


    this.state = {
      userLoggedIn: accessToken ? true : false,
      windowWidth: 0,
      windowHeight: 0
    }

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }


  // when <App/> first loads, determine whether we are in mobile or desktop mode
  componentDidMount() {
    this.updateWindowDimensions();
    //window.addEventListener('resize', this.updateWindowDimensions);
  }

  // clear dangling memory pointers
  componentWillUnmount() {
    //window.removeEventListener('resize', this.updateWindowDimensions);
  }

  // updates Window size so <App/> knows whether it should render in mobile or landscape
  updateWindowDimensions() {
    this.setState({windowWidth: window.innerWidth, windowHeight: window.innerHeight});
  }

  // returns true if we should render in mobile, false otherwise
  bool_renderMobile() {
    return (this.state.windowHeight > this.state.windowWidth);
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
    //window.open('http://localhost:8888', "_self");
    window.open('http://auth.spotifam.com', "_self");
  }

  // render --------------------------------------------------------------------

  // renders the currently selected page
  //  - DESKTOP   ->   [landing, webplayer]
  //  - MOBILE    ->   [findRoom]
  renderEmptyRoutePage = () => {
     if (this.bool_renderMobile()) {
        if(this.state.userLoggedIn) {
          return(
            <PlayerPage
              isMobile={this.bool_renderMobile()}
              spotifyAPI={spotifyAPI}
              spotifamAPI={spotifamAPI}
            />
          );
        }
        // mobile user will need to select a room
        else {
         return (
           <MobileOptionPage
             spotifamAPI={spotifamAPI}
           />
         );
        }

     } else {
       if (this.state.userLoggedIn) {

         // desktop user is logged in, so we want to render the webplayer
         return (
           <PlayerPage
             isMobile={this.bool_renderMobile()}
             spotifyAPI={spotifyAPI}
             spotifamAPI={spotifamAPI}
           />
         );
        } else {
          // desktop user isn't logged in so render the landing page
          return (
            <LandingPage
              onClick_loginToSpotify={this.onClick_loginToSpotify}
            />
          );
        }
     }
  }

  // renders the room page for users who want to access the via a room
  renderRoomPage = () => {
    return (
      <RoomPage/>
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
              {this.renderEmptyRoutePage()}
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
