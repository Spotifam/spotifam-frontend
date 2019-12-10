/*
  <GettingStarted/>

  Description:
    - <GettingStarted/> is an instruction guide that renders before the user has
      added any songs to the queue.

  Props:
    - [String] room_code

  Child Components
    - none yet
*/


import React, { Component } from 'react';
import './GettingStarted.css';

class GettingStarted extends Component {

  constructor() {
    super();
  }

  // render --------------------------------------------------------------------

  // Renders <GettingStarted/>
  render() {
    return (
      <div id="GettingStarted">
        <div id="TitleText">Getting Started</div>
        <div id="Steps">
          <div className="step">
            <div className="number">1</div>
            <div className="content">Make sure you have a Spotify player open</div>
          </div>
          <div className="step">
            <div className="number">2</div>
            <div className="content">Add songs by clicking the button below</div>
          </div>
          <div className="step">
            <div className="number">3</div>
            <div className="content">Invite friends with the room code</div>
            <div id="RoomCode">{this.props.room_code}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default GettingStarted;
