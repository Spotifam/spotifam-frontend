/*
  <MobileRoom/>

  Description:
    - <MobileRoom/> is a component that lets a user search for songs and add them to the queue

  Props:
    - [bool] usePlayerPageStyling: Changes style of page if its rendered on the player page.

  Child Components
    - none yet
*/


import React, { Component } from 'react';
import './MobileRoom.css';
import Alert from '../../../Alert/Alert';
import { Color } from 'three';

class MobileRoom extends Component {

  constructor() {
    super();

    this.state = {
      searchText: "",
      searchResults: [],
      searchActive: false,
      showAlert: false,
    }
  }

  // onINput -------------------------------------------------------------------

  onInput_updateSearchText = (e) => {
    if (this.state.showAlert) this.setState({showAlert: false});
    if (e.target.value !== this.state.searchText) {
      this.setState({searchText: e.target.value});
      this.onClick_performSearch(e.target.value);
    }
  }

  onClick_performSearch = (searchText) => {
    this.props.spotifamAPI.search(searchText, this.props.roomCode).then(result => {
      let songs = [];
      if (result !== undefined) {
        for (let i = 0; i < result.tracks.items.length && i < 5; i++) {
          songs.push(this.props.spotifamAPI.parseSong(result.tracks.items[i]));
        }
        this.setState({searchResults: songs});
        return songs;
      }

    }).then(result => {
      console.log(result);
      //this.props.spotifamAPI.addSong(result);
    })
    //this.setState({searchText: ""});
  }

  onClick_addSongToRoom = (song) => {
    this.props.spotifamAPI.addSong(song);
    this.setState({searchResults: [], searchText: "", searchActive: false, showAlert: true});
    //alert("Song added to queue!");
  }


  // render --------------------------------------------------------------------

  renderSearchResults = () => {
    let searchResults = this.state.searchResults;
    let songsToRender = [];
    for (let i = 0; i < searchResults.length && this.state.searchText !== ""; i++) {
      songsToRender.push(
        <div className={this.props.usePlayerPageStyling?"song_row desktop":"song_row"} onClick={() => this.onClick_addSongToRoom(searchResults[i])}>
          <div className="song_album_art_container">
            <img className="song_album_art" src={searchResults[i]['albumArt']}/>
          </div>
          <div className="song_text_container">
            <h3 className="song_title">{searchResults[i]['title']}</h3>
            <div className="song_album_and_artist_container">
              <p className="song_text">{searchResults[i]['album']}</p>
              <div className="dot"></div>
              <p className="song_text">{searchResults[i]['artist']}</p>
            </div>
          </div>
        </div>
      );
    }

    if (this.state.searchText !== "" && songsToRender.length === 0) {
      return (
        <div id="search_results_container">
          <p>No results found</p>
        </div>
      );
    } else {
      return (
        <div id="search_results_container">
          <Alert
            visible={this.state.showAlert}
          />
          {songsToRender}
        </div>
      );
    }

  }


  renderSearchBar = () => {

      return (
        <input
          id="search_input"
          value={this.state.searchText}
          onChange={this.onInput_updateSearchText.bind(this)}
          placeholder="Artists, songs, or albums"
          className={this.props.usePlayerPageStyling? "playerPage":"mobilePage"}
        />
      );
    
  }

  // Renders <MobileRoom/>
  render() {
    return (
      <div id="MobileRoom">
        <div id="search_title">{this.props.usePlayerPageStyling?"":"Search"}</div>
        {this.renderSearchBar()}
        {this.renderSearchResults()}
      </div>
    );
  }
}

export default MobileRoom;
