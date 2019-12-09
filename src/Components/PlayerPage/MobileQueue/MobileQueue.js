import React, { Component } from 'react';
import './MobileQueue.css';

class MobileQueue extends Component {

  renderSong (song_object, index) {
    var current = '';
    if (this.isCurrentSong(index)){
      current = 'currentSong';
    }



    return (
      <tr id = {current}>
      <td>{song_object.title}</td>
      <td>{song_object.artist}</td>
      <td>{song_object.album}</td>
      </tr>

    );
  }

  isCurrentSong (index) {
    // Check if a song is currently playing with its index into the songs array.
    return index === this.props.current_song;
  }
  
  // render --------------------------------------------------------------------

  render () {
    return (

        <table id="MobileQueueTable">
          <tbody>
            <tr>
              <th>TITLE</th>
              <th>ARTIST</th>
              <th>ALBUM</th>
            </tr>

            {/* Populate the table with songs stored in PlayerPage.js*/}
            {this.props.songs.map((song, index) => {
              return this.renderSong(song, index);
            })}
          </tbody>
        </table>

    );
  }
  
}

export default MobileQueue;