/*
  <PlayerPage/>

  Description:
    - <PlayerPage/> is the page the user sees when they are playing music.

  Props:
    - spotifyAPI: wrapper for the spotify API (already has user logged in)

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
    };
  }

  // Spotify API Interactions --------------------------------------------------

  // gets data about the song that is playing right now
  // right now, this just creates an alert -> eventually this should set state
  onClick_getNowPlaying = () => {
    this.props.spotifyAPI.getMyCurrentPlaybackState()
    .then((response) => {
      let info = {
        nowPlaying: {
          name: response.item.name,
          albumArt: response.item.album.images[0].url
        }
      };

      alert(JSON.stringify(info));

    }).catch(function(err) {
      console.log(err);
    });
  }


  // render --------------------------------------------------------------------

  // Renders <PlayerPage/>
  render() {
    return (
      <div id="PlayerPage">
        <h1>Webplayer</h1>
        <div id = "queue-container">
          <Queue
            current_song={this.state.current_song}
            songs={this.state.songs}
          />
        </div>

        <button onClick={this.onClick_getNowPlaying}>Get data about what is now playing</button>
      </div>
    );
  }
}

export default PlayerPage;
