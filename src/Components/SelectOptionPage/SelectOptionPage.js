
import React, { Component } from 'react';
import './SelectOptionPage.css';
import SelectRoomPage from './SelectRoomPage/SelectRoomPage.js'

class SelectOptionPage extends Component {

  constructor() {
    super();

    this.state = {
      option: 0
    };
  }

  // onInput -------------------------------------------------------------------

  // gets called when a user types into the room code <input/>
  // protects against users typing too many characters into the room code
  // upcases characters
  onClick_joinRoom = () => {

    this.setState({option: 1});
  }
  onClick_createRoom = () => {
    this.setState({option: 2});
  }

  // render --------------------------------------------------------------------

  // Renders <SelectRoomPage/>
  render() {

    if (this.state.option === 1) {
      return (
          <SelectRoomPage
          spotifamAPI={this.props.spotifamAPI}
          />
      );
    } else if(this.state.option === 2) {


    }else { //nothing selected
      
      return (
        <div id="SelectOptionPage">
          <div id="content_container">
            <img id="logo" alt="Spotifam" draggable="false" src="./spotifam_logo_outline.png"></img>
            <h3 className="text">Select your room option</h3>
            

            <div style={{'width': '100%', 'display': 'flex', 'justify-content': 'center'}}>
              <button 
                id="select_button"
                onClick={this.onClick_joinRoom}>
                JOIN
              </button>

              <button 
                id="select_button"
                onClick={this.onClick_createRoom}>
                CREATE
              </button>  
            </div>
          </div>
          <p className="italics_text" style={{'color': 'grey'}}>made with <span style={{'color': '#1DB954'}}>&#9829;</span> in Santa Cruz</p>
        </div>
      );
    }
  }
}

export default SelectOptionPage;
