/*
  <PlayerPage/>

  Description:
    - <PlayerPage/> is the page the user sees when they are playing music.

  Props:
    - none yet

  Child Components:
    - Queue (needs to be added)
    - Visualizer (needs to be added)
    - DisplaySong (needs to be added)
*/

import React, { Component } from 'react';
import './PlayerPage.css';


class PlayerPage extends Component {

  constructor() {
    super();
  }

  // render --------------------------------------------------------------------

  // Renders <PlayerPage/>
  render() {
    return (
      <div id="PlayerPage">
        <h1>Webplayer</h1>
      </div>
    );
  }
}

export default PlayerPage;
