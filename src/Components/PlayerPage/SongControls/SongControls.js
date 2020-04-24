/**
 * Manages the functionality of the <SongControls/> component.
 * Provides and interface for users to control the current playback and keeps
 * the device awake after music starts playing.
 * @see renderPlayButton()
 * 
 * Props:
 * @param {function} prev
 * @param {function} next
 * @param {function} pause
 * @param {function} play
 * @param {boolean} song_is_playing
 * @param {string} current_song_uri
 * 
 * Child Components:
 * N/A
 */

import React, { Component } from 'react';
import './SongControls.css';
import './MobileSongControls.css';
import ReactNoSleep from 'react-no-sleep';


// =============================================================================
// <SongControls/>
// =============================================================================

class SongControls extends Component {

  constructor() {
    super();
  }

  
  // ===========================================================================
  // Render
  // ===========================================================================

  renderPlayPauseButton() {
    /**
     * Render the play or pause button.
     * When clicked it will fire the play/pause function in the PlayerPage and 
     * keep the display awake if music is playing and allow it to sleep if not.
     * @see PlayerPage
     */
    
    // Change functionality/display based on whether song is playing or not
    let func, id, img;
    if (this.props.song_is_playing) {
      func = () => this.props.pause();
      id = 'pause';
      img = 'pause.png';
    } else {
      func = () => this.props.play(this.props.current_song_uri);
      id = 'play';
      img = 'play.png';
    }
    
    return(
      <ReactNoSleep>
        {({ isOn, enable, disable }) => (
          <button id={id} 
            onClick={() => {
              func();
              isOn ? disable() : enable();
            }}>
            <img src={img}/>
          </button>
        )}
      </ReactNoSleep>
    )
  }

  render() {
    /**
     * Render <SongControls/>.
     * Renders controls that allow the user to change the playback state.
     */

    let buttonClass = this.props.isMobile ? "mobileButtons" : "buttons";
    return (
        <div id={buttonClass}>
            <button id="prev" onClick={() => this.props.prev()}><img src="back.png"/></button>
            { this.renderPlayPauseButton() }
            <button id="next" onClick={() => this.props.next()}><img src="back.png"/></button>
        </div>
    );
  }
}

export default SongControls;
