/*
  <RoomPage/>

  Description:
    - <RoomPage/> is a page where users can search for songs and add them to the room's queue


  Props:
    - none yet

  Child Components
    - none yet
*/


import React, { Component } from 'react';
import './RoomPage.css';

class RoomPage extends Component {

  constructor() {
    super();
  }

  // render --------------------------------------------------------------------

  // Renders <RoomPage/>
  render() {

    // get the room code from the URL
    let urlPieces = window.location.href.split("/");
    let roomCode = urlPieces[urlPieces.length - 1];

    return (
      <div id="RoomPage">
        <p>Room Code: {roomCode}</p>
      </div>
    );
  }
}

export default RoomPage;
