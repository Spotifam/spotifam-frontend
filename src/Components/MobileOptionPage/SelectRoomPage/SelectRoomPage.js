/*
  <SelectRoomPage/>

  Description:
    - <SelectRoomPage/> is a component that lets users type in their room code
    - after typing in their room code, react router will take them to spotifam.casa/room/code

  Props:
    - none yet

  Child Components
    - <MobileRoom/>
*/


import React, { Component } from 'react';
import './SelectRoomPage.css';
import MobileRoom from './MobileRoom/MobileRoom.js';

const __roomCodeLength = 4;

class SelectRoomPage extends Component {

  constructor() {
    super();

    this.state = {
      roomCodeText: "",
      loggedIntoRoom: false
    };
  }

  // onInput -------------------------------------------------------------------

  // gets called when a user types into the room code <input/>
  // protects against users typing too many characters into the room code
  // upcases characters
  onInput_updateRoomCode = (e) => {
    if ((e.target.value !== this.state.roomCodeText) && (e.target.value.length <= __roomCodeLength)) {
      this.setState({roomCodeText: e.target.value.toUpperCase()});
    }
  }

  //
  onClick_selectRoom = () => {
    this.props.spotifamAPI.checkIfRoomExists(this.state.roomCodeText).then(result => {
      this.setState({loggedIntoRoom: result.exists});
      this.props.spotifamAPI.setRoomCode(this.state.roomCodeText);
    });
  }

  // render --------------------------------------------------------------------

  // renders the button that lets a user perform a search
  // the color of the button depends on whether the room code is formatted properly or not
  // if the room code is not formatted correctly, this button is not rendered with an onclick
  renderSearchButton = () => {
    if (this.state.roomCodeText.length === __roomCodeLength) {
      return (
        <button
          id="find_room_button_active"
          onClick={this.onClick_selectRoom}>
          GO
        </button>
      );
    } else {
      return (
        <button id="find_room_button_inactive">GO</button>
      );
    }
  }

  // Renders <SelectRoomPage/>
  render() {

    if (! this.state.loggedIntoRoom) {
      return (
        <div id="SelectRoomPage">
          <div id="content_container">
            <img id="logo" alt="Spotifam" draggable="false" src="./spotifam_logo_outline.png"></img>
            <h3 className="text">Find your room</h3>
            <p className="italics_text" style={{'color': '#c9c9c9'}}>No Spotify Login required</p>
            <input
              id="room_code_input"
              placeholder="ABCD"
              value={this.state.roomCodeText}
              onChange={this.onInput_updateRoomCode.bind(this)}
            />

            <div style={{'width': '100%', 'display': 'flex', 'justifyContent': 'flex-end'}}>
              {this.renderSearchButton()}
            </div>
          </div>
          <p className="italics_text" style={{'color': 'grey'}}>made with <span style={{'color': '#1DB954'}}>&#9829;</span> in Santa Cruz</p>
        </div>
      );
    } else {
      return (
        <div>
          <MobileRoom
            spotifamAPI={this.props.spotifamAPI}
            roomCode={this.state.roomCodeText}
          />
        </div>
      );
    }
  }
}

export default SelectRoomPage;
