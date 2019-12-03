/*
  <SongControls/>

  Description:
    - <SongControls/> is an interface for users to interact with the queue.

  Props:
    - prev()
    - next()
    - pause()
    - play()
    - song_is_playing
    - current_song_uri

  Child Components
    - none yet
*/


import React, { Component } from 'react';
import './MobileSongDetails.css';

class MobileSongDetails extends Component {

  constructor() {
    super();
  }

  // render --------------------------------------------------------------------

  // Renders <MobileSongDetails/>
  render() {
    if (this.props.nowPlaying.name != ''){
      return (
        <div id="MobileSongDetails">
          <p id="nowPlaying">Now Playing</p>
          <div id="currsong_container">
            <div id="image_container">
              <img src={this.props.nowPlaying.albumArt} id="album_art" />
            </div>

            <div id="detail_container" >
              <div id="song_name"> { this.props.nowPlaying.name }</div>
              <div id="song_artist"> {this.props.nowPlaying.artist} </div>
              
            </div>

          </div>
        </div>
      );
    } else{
      return (
        <div>
          <div id="song_details_song">
            No song is currently playing.
          </div>
          <div id="song_details_button" style={{'paddingTop': "1em"}}>
            {/*<button onClick={() => this.api_getSongDetails()}>Get current song info</button>*/}
          </div>
        </div>
      );
    }
  }
}

export default MobileSongDetails;
