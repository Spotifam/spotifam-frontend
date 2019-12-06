import React, { Component } from 'react';
import threeEntryPoint from './threejs/threeEntryPoint';
import "./synthViz.css";


// implementing React and Three.js together based off of https://itnext.io/how-to-use-plain-three-js-in-your-react-apps-417a79d926e0
export default class SynthViz extends Component {  
		
	// pass reference to div to entry point function
	componentDidMount() {
		threeEntryPoint(this.threeRootElement);
	}

	// render three.js canvas container
	render () {
		return (
			<div className="synthviz-page" ref={element => this.threeRootElement = element} />
		);
	}
}
