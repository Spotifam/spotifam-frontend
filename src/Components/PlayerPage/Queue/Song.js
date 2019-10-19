/*
  <Song />

  Description:
    - <Song /> is an html row element that displays a song:
      + Title
      + Artist
      + Album
      + Duration

  Props:
    - id [str]
    - song = {
              title:    [str],
              artist:   [str],
              album:    [str],
              duration: [str]
             }
    - current [int]

  Children:
    - None

*/

import React, { Component } from 'react';
import "./Song.css";

class Song extends Component {

// render --------------------------------------------------------------------

  render () {
    return (
        <tr
          draggable
          id={this.props.id}
          className={this.props.current}
        >
          <td>{this.props.song.title}</td>
          <td>{this.props.song.artist}</td>
          <td>{this.props.song.album}</td>
          <td>{this.props.song.duration}</td>

          {/* 
              Elements under dropzones will be used for deciding where
              the user intends to drop a song. The divs take up the top and
              bottom 50% (respectively) of each row. When the user drops on
              "above" it will insert above the row and vice versa for "below". 
              For clarification, inspect element on "dropzones"
              
              TODO: Use React Drag and Drop package.
          */}
          <div className="dropzones">
            <div 
              className="above"
            >a</div>
            <div
              className="below"
            >b</div>
          </div>
        </tr>
    );
  }
}


export default Song;
