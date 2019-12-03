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
import './SongControls.css';
import './MobileSongControls.css';

class SongControls extends Component {

  constructor() {
    super();
  }

  // render --------------------------------------------------------------------

  // Renders <SongControls/>
  render() {
    if(this.props.isMobile) {
      if(this.props.song_is_playing) {
        return (
            <div id="mobileButtons">
                <button id="prev"  onClick={() => this.props.prev()}><img src="back.png"/></button>
                <button id="pause" onClick={() => this.props.pause()}><img src="pause.png"/></button>
                <button id="next"  onClick={() => this.props.next()}><img src="back.png"/></button>
            </div>
         );
      }
      else{
        return (
            <div id="mobileButtons">
                <button id="prev" onClick={() => this.props.prev()}><img src="back.png"/></button>
                <button id="play" onClick={() => this.props.play(this.props.current_song_uri)}><img src="play.png"/></button>
                <button id="next" onClick={() => this.props.next()}><img src="back.png"/></button>
            </div>
        );
      }
    } else {
      if(this.props.song_is_playing) {
        return (
            <div id="buttons">
                <button id="prev"  onClick={() => this.props.prev()}><img src="back.png"/></button>
                <button id="pause" onClick={() => this.props.pause()}><img src="pause.png"/></button>
                <button id="next"  onClick={() => this.props.next()}><img src="back.png"/></button>
            </div>
         );
      }
      else{
        return (
            <div id="buttons">
                <button id="prev" onClick={() => this.props.prev()}><img src="back.png"/></button>
                <button id="play" onClick={() => this.props.play(this.props.current_song_uri)}><img src="play.png"/></button>
                <button id="next" onClick={() => this.props.next()}><img src="back.png"/></button>
            </div>
        );
      }
    }
  }
}

export default SongControls;
