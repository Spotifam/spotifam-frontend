/*
  <App/>

  Description:
    - <App/> is the root component of Spotifam's website

  Props:
    - <App/> does not have any props

  Child Components
    - LandingPage: initial page user sees when they come to the website
    - PlayerPage: page user sees when they are listening to music
*/


import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// components
import LandingPage from './Components/LandingPage/LandingPage.js';
import PlayerPage from './Components/PlayerPage/PlayerPage.js';


// =============================================================================
// Constants
// =============================================================================

let __pages = ['landing', 'webplayer']; // pages that the user can be on


// =============================================================================
// <App/>
// =============================================================================

class App extends Component {

  constructor() {
    super();

    this.state = {
      currentPage: __pages[0]
    }
  }


  // onClick -------------------------------------------------------------------
  /*
     onClick and onInput functions that modify App.state
  */

  // brings a user to a different page
  onClick_selectNewPage = (page) => {
    if ((__pages.indexOf(page) >= 0) && (this.state.currentPage !== page)) {
      this.setState({currentPage: page});
    }
  }

  // render --------------------------------------------------------------------

  // returns the currently selected page (landing, webplayer, etc)
  renderPage = () => {

    // if the selected page does not exist, do not render it
    if (__pages.indexOf(this.state.currentPage) < 0) {
      return;
    } else if (this.state.currentPage === "landing") {
      return (
        <LandingPage
          onClick_moveToWebPlayer={() => this.onClick_selectNewPage("webplayer")}
        />
      );
    } else if (this.state.currentPage === "webplayer") {
      return (
        <PlayerPage/>
      );
    }
  }

  // renders <App/>
  render() {
    return (
      <div className="App">
        {this.renderPage()}
      </div>
    );
  }
}

export default App;
