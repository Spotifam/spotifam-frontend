/*
  <Queue />

  Description:
    - <Queue /> is an html table element that displays a list of songs.

  Props:
    - current_song [int]
    - songs [arr<song>]

  Children:
    - Song

*/

import React, { Component } from 'react';
import Song from './Song.js';
import { v4 } from 'uuid'; // Returns a uuid [str]
import './Queue.css';

class Queue extends Component {
  renderSong (song_object, index) {
    var id = v4(); // generate uuid
    
    var current = '';
    if (this.isCurrentSong(index)){
      current = 'currentSong';
    }

    return (
      <Song
        key={id} // Used in React.
        id={id}  // Used as html id.
        song={song_object}
        current={current}
      />
    );
  }

  isCurrentSong (index) {
    // Check if a song is currently playing with its index into the songs array.
    return index === this.props.current_song;
  }
  
  // render --------------------------------------------------------------------

  render () {
    return (
      <table id="Queue">
        <tbody>
          <tr>
            <th>TITLE</th>
            <th>ARTIST</th>
            <th>ALBUM</th>
            <th>DURATION</th>
          </tr>

          {/* Populate the table with songs stored in App.js*/}
          {this.props.songs.map((song, index) => {
            return this.renderSong(song, index);
          })}
        </tbody>
      </table>
    );
  }
  
}

export default Queue;
