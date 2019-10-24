/*
  <PlayerPage/>

  Description:
    - <PlayerPage/> is the page the user sees when they are playing music.

  Props:
    - spotifyAPI: wrapper for the spotify API (already has user logged in)
                  follows wrapper definitions from https://github.com/jmperez/spotify-web-api-js

  Child Components:
    - Queue
    - Visualizer (needs to be added)
    - DisplaySong (needs to be added)
*/

import React, { Component } from 'react';
import './PlayerPage.css';
import Queue from './Queue/Queue.js';


// constants -------------------------------------------------------------------

const __songs =  [
  // Example song list.
  {
    title:        "End Of The Day",
    artist:                 "Beck",
    album:            "Sea Change",
    duration:              "5:03" ,
  },
  {
    title:    "Conversation Piece",
    artist:          "David Bowie",
    album:    "Conversation Piece",
    duration:               "3:11",
  },
  {
    title:              "Rainbows",
    artist:         "David Wilson",
    album:    "Pacific Ocean Blue",
    duration:               "2:48",
  },
  {
    title:        "Watermelon Man",
    artist:       "Herbie Hancock",
    album:          "Head Hunters",
    duration:               "6:29",
  },
  {
    title:       "Breath of Night",
    artist:       "Osamu Kitajima",
    album:    "Masterless Samurai",
    duration:               "6:53",
  },
];

// =============================================================================
// <PlayerPage/>
// =============================================================================

class PlayerPage extends Component {

  constructor() {
    super();
    this.state = {
      current_song: 1,
      songs: __songs,
      debugModeActive: true
    };
    
    // We want the <Song/> component to be able to edit PlayerPage.songs so
    // we bind the state of this function to PlayerPage.
    this.onQueueDrop = this.onQueueDrop.bind(this);
  }

  // Spotify API Interactions --------------------------------------------------
  /*
    functions for interacting with Spotify API
      - api_getNowPlaying():        returns information about the song that is currently playing
      - api_playSong():             plays a specified song (or the currently selected one if none selected)
      - api_pauseSong():            pauses the spotify player
      - api_goToNextSong():         skips to the next song
      - api_goToPrevSong():         goes to the previously played song
      - api_searchForSong():        searches for a track with the right name
  */


  // gets data about the song that is playing right now
  // right now, this just creates an alert -> eventually this should set state
  api_getNowPlaying = () => {
    this.props.spotifyAPI.getMyCurrentPlaybackState()
    .then((response) => {
      let info = {
        nowPlaying: {
          name: response.item.name,
          albumArt: response.item.album.images[0].url,
          spotifyURI: response.item.uri,
          deviceID: response.device.id
        }
      };

      alert(JSON.stringify(info));
      console.log(response);

    }).catch(function(err) {
      console.log(err);
    });
  }


  // plays a song with a given songID
  // songID can be one of 3 options:
  //  1) null                     ->  plays whatever song Spotify has selected
  //  2) a trackID                ->  plays the song with the given ID  ex: "spotify:track:0ZiGRciYMWrDvCPNM0T21o"
  //  3) a list of trackIDs       ->  plays the first song in the list and adds the rest to top of queue
  // reference: https://developer.spotify.com/documentation/web-api/reference/player/start-a-users-playback/
  api_playSong = (songID = null) => {

    let playObject = {};
    if (songID !== null) {
      if (typeof songID === "string") {
        playObject = { "uris": [songID] };
      } else if ((typeof songID === "object") && (Array.isArray(songID))) {
        playObject = { "uris": songID };
      }
    }

    this.props.spotifyAPI.play(playObject)
    .then((response) => {
      console.log(response)
    }).catch(function(err) {
      console.log(err);
    });
  }


  // pauses playback
  api_pauseSong = () => {
    this.props.spotifyAPI.pause();
  }

  // skips a song
  api_goToNextSong = () => {
    this.props.spotifyAPI.skipToNext();
  }

  // goes back to the last song
  api_goToPrevSong = () => {
    this.props.spotifyAPI.skipToPrevious();
  }

  // performs a search for a song
  api_searchForSong = (query) => {
    let resultTypes = ["track"];
    this.props.spotifyAPI.search(query, resultTypes)
    .then((result) => {
      alert('check console for result');
      console.log(result);
    }).catch(function(err) {
      console.log(err);
    });
  }

  // queue ---------------------------------------------------------------------
  
  onQueueDrop(song, drag_index, drop_index, pos) {
    // Check if dragged on self
    if (drag_index === drop_index) {
      return;
    }
    
    // Delete dragged song
    var songs = this.state.songs.slice();

    // Delete dragged song from Queue
    songs.splice(drag_index, 1);

    // Check if song is being dropped above or below and acount for
    // shift from deleting dragged song. Since we are directly modifying a
    // value as we are inserting indicies get wonky.
    var offset = 0;
    if (pos === "above"){
      offset = (drag_index > drop_index) ? 0 : -1;
    } else if (pos === "below"){
      offset = (drop_index > drag_index) ? 0 :  1;
    }

    // Edit the songs array and update state.
    songs.splice(drop_index+offset, 0, song);

    // Update songs array
    this.setState({songs: songs});
  }

  // render --------------------------------------------------------------------


  // renders the <Queue/>
  renderQueue = () => {
    return (
      <div id="queue_container">
        <p>queue goes here</p>
        <Queue
          current_song={this.state.current_song}
          songs={this.state.songs}
          onQueueDrop={this.onQueueDrop}
        />
      </div>
    );
  }

  // renders component for displaying album art / name
  renderSongDetails = () => {
    return (
      <div id="song_details_container">
        <p>song details will go here</p>
      </div>
    );
  }

  // renders component that user interacts with to play/pause/skip
  renderSongControls = () => {
    return (
      <div id="song_controls_container">
        <p>spotify controller will go here</p>
      </div>
    );
  }

  // renders buttons that show developers helpful buttons w/ API functionality
  renderAPIHelp = () => {

    if (this.state.debugModeActive) {
      return (
        <div style={{'display': 'flex', 'flex-direction': 'column', 'width': '100%', 'justifyContent': 'center', 'alignItems': 'center'}}>
          <button onClick={() => this.setState({'debugModeActive': false})}>Hide API help buttons</button>
          <button onClick={this.api_getNowPlaying}>Get data about what is playing right now</button>
          <button onClick={() => this.api_playSong(["spotify:track:0rRboI6IRuGx56Dq3UdYY4", "spotify:track:6HUFOiTIGCizkemQxhQTao", "spotify:track:6K4t31amVTZDgR3sKmwUJJ"])}>Play a specific song</button>
          <button onClick={() => this.api_pauseSong()}>Pause song</button>
          <button onClick={() => this.api_playSong()}>Resume song</button>
          <button onClick={() => this.api_goToNextSong()}>Next song</button>
          <button onClick={() => this.api_goToPrevSong()}>Prev song</button>
          <button onClick={() => this.api_searchForSong("The less i know the ")}>Example Search: The Less I K</button>
        </div>
      );
    } else {
      return (
        <div>
          <button onClick={() => this.setState({'debugModeActive': true})}>Show API help buttons</button>
        </div>
      );
    }
  }

  // Renders <PlayerPage/>
  render() {
    return (
      <div id="PlayerPage">
        <div id="title_row">
          <h1 id="spotifam_title">Spotifam</h1>
          <h3 id="room_code_text">spotifam.casa/room/CODE</h3>
        </div>

        <div id="content_container">
          {this.renderSongDetails()}
          {this.renderSongControls()}
          {this.renderQueue()}
          {this.renderAPIHelp()}
        </div>

      </div>
    );
  }
}

export default PlayerPage;
