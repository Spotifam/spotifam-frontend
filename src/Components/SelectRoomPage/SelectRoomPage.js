/*
  <SelectRoomPage/>

  Description:
    - <SelectRoomPage/> is a component that lets users type in their room code
    - after typing in their room code, react router will take them to spotifam.casa/room/code

  Props:
    - none yet

  Child Components
    - none yet
*/


import React, { Component } from 'react';
import './SelectRoomPage.css';


const __roomCodeLength = 4;

class SelectRoomPage extends Component {

  constructor() {
    super();

    this.state = {
      roomCodeText: ""
    };
  }

  // onInput -------------------------------------------------------------------

  // gets called when a user types into the room code <input/>
  // protects against users typing too many characters into the room code
  onInput_updateRoomCode = (e) => {
    if ((e.target.value !== this.state.roomCodeText) && (e.target.value.length <= __roomCodeLength)) {
      this.setState({roomCodeText: e.target.value});
    }
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
          >Go
        </button>
      );
    } else {
      return (
        <button id="find_room_button_inactive">go</button>
      );
    }
  }

  // Renders <SelectRoomPage/>
  render() {
    return (
      <div id="SelectRoomPage">
        <div id="content_container">
          <h1 id="title">Spotifam</h1>
          <h3 className="text">Find your room</h3>
          <p className="italics_text" style={{'color': '#c9c9c9'}}>No Spotify Login required</p>
          <input
            id="room_code_input"
            placeholder="ABCD"
            value={this.state.roomCodeText}
            onChange={this.onInput_updateRoomCode.bind(this)}
          />

          <div style={{'width': '100%', 'display': 'flex', 'justify-content': 'flex-end'}}>
            {this.renderSearchButton()}
          </div>
        </div>
        <p className="italics_text" style={{'color': 'grey'}}>made with <span style={{'color': '#46e200'}}>&#9829;</span> in Santa Cruz</p>
      </div>
    );
  }
}

export default SelectRoomPage;
