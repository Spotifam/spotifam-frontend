/*
  <LandingPage/>

  Description:
    - <LandingPage/> is the page the user sees when they first come to the website
    - This page contains a description of Spotifam so the user can learn about the service
    - It also allows them to login with their Spotify credentials

  Props:
    - onClick_loginToSpotify(): takes user to a different webpage (localhost:8888) to login to Spotify via OAuth
                                This passes back an access token via the webpage URL that we can use

  Child Components
    - SpotifyLogin (needs to be added)
*/


import React, { Component } from 'react';
import './LandingPage.css';

class LandingPage extends Component {

  constructor() {
    super();
  }

  // render --------------------------------------------------------------------

  // Renders <LandingPage/>
  render() {
    return (
      <div id="LandingPage">
        <h1>Landing Page!</h1>
        <button onClick={this.props.onClick_loginToSpotify}>Login to Spotify</button>
      </div>
    );
  }
}

export default LandingPage;