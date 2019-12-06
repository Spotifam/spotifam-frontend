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
import SynthViz from './SynthViz/synthViz.js';

class VisualizerPage extends Component {

  constructor() {
    super();
    this.state = {
      viz : 0,
    };
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
            <DVDLogo/>
        </div>
      );
    }
    else if(this.state.viz === 2){
      return(
        <div>
            <SynthViz
              spotifyAPI={this.props.spotifyAPI}
              turnOffVisualizer={this.props.turnOffVisualizer}
            />
        </div>
      );
    }
    else{
      return (
        <div id="VisualizerPage">
          <h1 id="viz-title">Music Visualizers</h1>
          <div>
            <button id="synth" class="vizButtons" onClick={() => this.setState({viz: 2})}>Synthwave Visualizer</button>
            <button id="dvd" class="vizButtons" onClick={() => this.setState({viz: 1})}>DVD Logo Visualizer</button>
          </div>
        </div>
      );
    }
  }
}

export default VisualizerPage;
