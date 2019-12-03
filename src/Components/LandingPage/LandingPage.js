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

          <div className="topnav">
            <img draggable="false" src="./spotifam_logo.png"/>
          </div>
          <div className="contents">
            <h1>Control your music as a group.</h1>
            <p>Create a song queue that everyone can use.</p>
            <button onClick={this.props.onClick_loginToSpotify}>LOGIN TO SPOTIFY</button>    
          </div>

      
      </div>
    );
  }
}

export default LandingPage;
