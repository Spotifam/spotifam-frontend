/*
  <MobileRoom/>

  Description:
    - <MobileRoom/> is a component that lets a user search for songs and add them to the queue

  Props:
    - none yet

  Child Components
    - none yet
*/


import React, { Component } from 'react';
import './MobileRoom.css';

class MobileRoom extends Component {

  constructor() {
    super();

    this.state = {
      searchText: "",
      searchResults: {}
    }
  }

  // onINput -------------------------------------------------------------------

  onInput_updateSearchText = (e) => {
    if (e.target.value !== this.state.searchText) {
      this.setState({searchText: e.target.value});
    }
  }

  onClick_performSearch = () => {
    this.props.spotifamAPI.search(this.state.searchText, this.props.roomCode).then(result => {
      return this.props.spotifamAPI.parseSong(result.tracks.items[0]);
    }).then(result => {
      this.props.spotifamAPI.addSong(result);
    })
    this.setState({searchText: ""});
  }


  // render --------------------------------------------------------------------

  // Renders <MobileRoom/>
  render() {
    return (
      <div id="MobileRoom">
        <h1>Search</h1>
        <input onChange={this.onInput_updateSearchText.bind(this)} value={this.state.searchText}/>
        <button onClick={this.onClick_performSearch}>Search</button>
      </div>
    );
  }
}

export default MobileRoom;
