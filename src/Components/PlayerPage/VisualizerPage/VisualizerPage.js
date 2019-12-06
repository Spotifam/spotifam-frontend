/*
  <VisualizerPage/>

  Description:
    - <VisualizerPage/> is...

  Props:
    - none yet

  Child Components
    - none yet
*/


import React, { Component } from 'react';
import './VisualizerPage.css';
import DVDLogo from './DVDLogo/DVDLogo.js';

class VisualizerPage extends Component {

  constructor(props) {
    super();
    this.state = {
      viz : 0,
      nowPlaying: {
        name: '',
        artist: '',
        albumArt: '',
        progress_ms: 0
      },
    };
  }

  goBack(){
    this.setState({
      viz: 0,
    })
  }

  // render --------------------------------------------------------------------

  // Renders <VisualizerPage/>
  render() {
    if(this.state.viz === 1){
      return(
        <div>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.9.0/p5.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.9.0/addons/p5.dom.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.9.0/addons/p5.sound.min.js"></script>
            <DVDLogo viz={this.goBack.bind(this)}/>
            <img id="song_details_album_art" src={this.state.nowPlaying.albumArt} />
        </div>
      );
    }
    else{
      return (
        <div id="VisualizerPage">
          <h1>viz page</h1>
          <div>
            <button id="dvd" onClick={() => this.setState({viz: 1})}>DVD Logo Visualizer</button>
          </div>
        </div>
      );
    }
  }
}

export default VisualizerPage;
