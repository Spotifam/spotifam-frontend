/*
  <PlayerPage/>
  Description:
    - <PlayerPage/> is the page the user sees when they are playing music.
  Props:
    - spotifyAPI: wrapper for the spotify API (already has user logged in)
                  follows wrapper definitions from https://github.com/jmperez/spotify-web-api-js
  Child Components:
    - Queue
    - Visualizer (needs to be added)
    - SongDetails
*/

import React, { Component } from 'react';
import './PlayerPage.css';
import "./MobilePlayerPage.css";
import Queue from './Queue/Queue.js';
import { throwStatement } from '@babel/types';
import VisualizerPage from './VisualizerPage/VisualizerPage.js';
import SongControls from './SongControls/SongControls';
import MobileSongDetails from './MobileSongDetails/MobileSongDetails.js';
import "../MobileOptionPage/SelectRoomPage/MobileRoom/MobileRoom";
import Alert from '../Alert/Alert';
import MobileRoom from '../MobileOptionPage/SelectRoomPage/MobileRoom/MobileRoom';
import MobileQueue from "./MobileQueue/MobileQueue.js"



// constants -------------------------------------------------------------------

const __refreshLimit = 1; // for how often to refresh spotify info (in seconds)

// TODO: remove this and make it actually represent the queue
const __songs =  [
];

// =============================================================================
// <PlayerPage/>
// =============================================================================

class PlayerPage extends Component {
  constructor(props) {
    super();
    props.spotifamAPI.createRoom();
    this.state = {
      paused_by_user: true,
      current_device_id: "",
      current_song: 0,
      songs: __songs,
      debugModeActive: true,
      nowPlaying: {
        name: '',
        artist: '',
        albumArt: '',
        progress_ms: 0
      },
      songPlaying: false,
      secondsPassed: 0,
      visualizerPage: false,
      searching: false
    };

    // We want the <Song/> component to be able to edit PlayerPage.songs so
    // we bind the state of this function to PlayerPage.
    this.onQueueDrop = this.onQueueDrop.bind(this);
  }

  // Timer ---------------------------------------------------------------------
  /*
    functions that involve a timer, including updating state info about the current playing song
  */


  // when component mounts, set a timer on an infinite loop
  // -> this timer gets used to make sure we are updating our info from spotify
  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  // when leaving the app, make sure we remove dangling pointers
  componentWillUnmount() {
    clearInterval(this.timerID);
  }


  // function gets called every second to update the timer
  // every time secondsPassed gets to __refreshLimit, we want to grab info from spotify
  tick() {
    if (this.state.secondsPassed > __refreshLimit) {
      this.api_getSongDetails();
      this.api_setDevice();
      this.setState({secondsPassed: 0});
      this.api_handleAutoPlay();
      var self = this;
      this.props.spotifamAPI.getQueue().then(function (result) {
        var list = self.state.songs;
        if (result) {
          list = result['list'];
        }
        self.setState({songs: list});
      });
    } else {
      this.setState({secondsPassed: this.state.secondsPassed + 1});
    }
  }

  // Spotify API Interactions --------------------------------------------------
  /*
    functions for interacting with Spotify API
      - api_getNowPlaying():        returns information about the song that is currently playing
      - api_playSong():             plays a specified song (or the currently selected one if none selected)
      - api_pauseSong():            pauses the spotify player
      - api_goToNextSong():         skips to the next song
      - api_goToPrevSong():         goes to the previously played song
      - api_searchForSong():        searches for a track with the right name
      - api_setDevice():            sets the current device to start playback on.
  */


  // gets data about the song that is playing right now
  // right now, this just creates an alert -> eventually this should set state
  api_getNowPlaying = () => {
    this.props.spotifyAPI.getMyCurrentPlaybackState()
    .then((response) => {
      let info = {
        nowPlaying: {
          name: response.item.name,
          albumArt: response.item.album.images[0].url,
          spotifyURI: response.item.uri,
          deviceID: response.device.id
        }
      };

      alert(JSON.stringify(info));
      console.log(response);

    }).catch(function(err) {
      console.log(err);
    });
  }

  api_getSongDetails = () => {
    this.props.spotifyAPI.getMyCurrentPlaybackState()
    .then((response) => {

      // TODO: remove this console.log
      console.log(response.is_playing);
      console.log('----');
      console.log(response);
      console.log('----');
      
      this.setState({
        nowPlaying: {
          name: response.item.name,
          artist: response.item.artists[0].name,
          albumArt: response.item.album.images[0].url,
          uri: response.item.uri,
          progress_ms: response.progress_ms
        },
        songPlaying: response.is_playing
      });
      console.log(response);
    }).catch(function(err) {
      console.log(err);
    });
  }


  // plays a song with a given songID
  // songID can be one of 3 options:
  //  1) null                     ->  plays whatever song Spotify has selected
  //  2) a trackID                ->  plays the song with the given ID  ex: "spotify:track:0ZiGRciYMWrDvCPNM0T21o"
  //  3) a list of trackIDs       ->  plays the first song in the list and adds the rest to top of queue
  // reference: https://developer.spotify.com/documentation/web-api/reference/player/start-a-users-playback/
  api_playSong = (songID = null) => {
    let playObject = {};
    this.props.spotifyAPI.setRepeat('off'); // turn off repeat so autoplay works
    if (songID !== null) {
      if (typeof songID === "string") {
        playObject = { "uris": [songID] };
      } else if ((typeof songID === "object") && (Array.isArray(songID))) {
        playObject = { "uris": songID };
      }
    }

    // Handles which device to play a song on
    if (this.state.current_device_id !== "") {
      playObject["device_id"] = this.state.current_device_id; 
    }

    // Handle resuming from last pause
    if (playObject.uris[0] === this.state.nowPlaying.uri | this.state.songs.length === 0) {
      this.props.spotifyAPI.play();
    } else {
      this.props.spotifyAPI.play(playObject);
    }
    
    this.setState({paused_by_user: false});
  }


  // pauses playback
  api_pauseSong = () => {
    this.props.spotifyAPI.pause();
    this.setState({paused_by_user: true});
  }

  // skips a song
  api_goToNextSong = () => {
    var curr = this.state.current_song;
    if (this.state.current_song !== this.state.songs.length - 1 ) {
      curr++;
      this.setState({current_song: curr});
    } else {
      curr = 0;
      this.setState({current_song: curr});
    }
    var current_song_uri = {"uris": [this.state.songs[curr].uri]};
    this.props.spotifyAPI.play(current_song_uri);
  }

  // goes back to the last song
  api_goToPrevSong = () => {
    var curr = this.state.current_song;
    
    if (this.state.current_song !== 0 && this.state.nowPlaying.progress_ms < 5000) {
      curr--;
      this.setState({current_song: curr});
    }
    var current_song_uri = {"uris": [this.state.songs[curr].uri]};
    this.props.spotifyAPI.play(current_song_uri);
  }

  // performs a search for a song
  api_searchForSong = (query) => {
    let resultTypes = ["track"];
    this.props.spotifyAPI.search(query, resultTypes)
    .then((result) => {
      alert('check console for result');
      console.log(result);
    }).catch(function(err) {
      console.log(err);
    });
  }

  // Get Spotify Devices
  api_setDevice = () => {
    /*
      Finds the most recently opened device and makes it the
      default playback device.
    */
    
    var self = this;
    this.props.spotifyAPI.getMyDevices().then(function (result) {
      if (result.devices) {
        self.setState({current_device_id: result.devices[0].id});
      }
    });
  }

  api_handleAutoPlay = () => {
    var self = this;
    this.props.spotifyAPI.getMyCurrentPlaybackState()
    .then((response) => {
      if (this.state.songs.length !== 0) {
        //var total_time = self.state.songs[this.state.current_song].duration;
        if (response.is_playing === false & this.state.paused_by_user === false) {
          self.api_goToNextSong();
        }
      }
    });
  }

  // queue ---------------------------------------------------------------------

  onQueueDrop(song, drag_index, drop_index, pos) {
    // Check if dragged on self
    if (drag_index === drop_index) {
      return;
    }

    // Copy songs array
    var songs = this.state.songs.slice();

    // Delete dragged song from Queue
    songs.splice(drag_index, 1);

    // Check if song is being dropped above or below and acount for
    // shift from deleting dragged song. Since we are directly modifying a
    // value as we are inserting indicies get wonky.
    var offset = 0;
    if (pos === "above") {
      offset = (drag_index > drop_index) ? 0 : -1;
    } else if (pos === "below") {
      offset = (drop_index > drag_index) ? 0 :  1;
    }

    // Edit the songs array and update state.
    songs.splice(drop_index+offset, 0, song);

    // Handle current song movement
    if (drag_index === this.state.current_song) { // if the current song is moved
      this.setState({current_song: drop_index + offset});
    } else if (drag_index === drop_index + offset) { // if a song doesn't change place.
      // do nothing.
    } else if (drag_index < this.state.current_song && drop_index >= this.state.current_song) {
      this.setState({current_song: this.state.current_song - 1});
    } else if (drag_index > this.state.current_song && drop_index <= this.state.current_song) {
      this.setState({current_song: this.state.current_song + 1});
    }

    // Update queue changes on the server
    this.props.spotifamAPI.updateQueue(songs);

    // Update songs array
    this.setState({songs: songs});
  }

  // render --------------------------------------------------------------------


  // renders the <Queue/>
  renderQueue = () => {
    return (
      <div id="queue_container">
        <Queue
          current_song={this.state.current_song}
          songs={this.state.songs}
          onQueueDrop={this.onQueueDrop}
        />
      </div>
    );
  }


  // renders component for displaying album art / name
  //
  // will need to call the api every x units to have it automatically
  // change song display on song change
  renderSongDetails = () => {
    if (this.state.nowPlaying.name != ''){
      return (
        <div id="song_details_container" style={{'display': 'flex', 'flexDirection': 'column', 'justifyContent': 'center', 'alignItems': 'center'}}>
          <div>
            <img id="song_details_album_art" src={this.state.nowPlaying.albumArt} />
          </div>
          <div id="song_details_text" style={{'paddingTop': "1em"}}>
            <div id="song_details_song">
              { this.state.nowPlaying.name }
            </div>
            <div id="song_details_artist">
              {this.state.nowPlaying.artist}
            </div>
          </div>
        </div>
      );
    } else{
      return (
        <div id="song_details_container" style={{'display': 'flex', 'flexDirection': 'column', 'justifyContent': 'center', 'alignItems': 'center'}}>
          <div id="song_details_song">
            No song is currently playing.
          </div>
          <div id="song_details_button" style={{'paddingTop': "1em"}}>
            {/*<button onClick={() => this.api_getSongDetails()}>Get current song info</button>*/}
          </div>
        </div>
      );
    }
  }

  renderMobileSongDetails = () => {
    return (
      <MobileSongDetails
        nowPlaying={this.state.nowPlaying}
      />
    );
  }

  renderMobileQueueContainer = () => {
    return (
      <MobileQueue
        songs={this.state.songs}
        current_song={this.state.current_song}
      />
    );
  }

  // renders component that user interacts with to play/pause/skip
  renderSongControls = () => {
    return (
      
        <SongControls
          isMobile={this.props.isMobile}
          prev={this.api_goToPrevSong}
          next={this.api_goToNextSong}
          pause={this.api_pauseSong}
          play={this.api_playSong}
          song_is_playing={this.state.songPlaying}
          current_song_uri={(this.state.songs.length === 0) ? "" : this.state.songs[this.state.current_song].uri}
        />
    );

  }

  renderRightPanel = () => {
    if (this.state.searching) {
      return (
        <div id="container_right">
          <div id="search_container">
            <MobileRoom
              spotifamAPI={this.props.spotifamAPI}
              usePlayerPageStyling={true}
            />
          </div>
          <button id="ToggleSearch" onClick={ () => this.setState({searching: false})}>
            <div id="ToggleSearchIcon">≡</div>
            <div id="ToggleSearchText">View Queue</div>
          </button>
        </div>
        
      );
    } else {
      return(
        <div id="container_right">
          {this.renderQueue()}
          <button id="ToggleSearch" onClick={() => this.setState({searching: true})}>
            <div id="ToggleSearchIcon">+</div>
            <div id="ToggleSearchText">Add Songs</div>
          </button>
        </div>
      );
    }
  }

  turnOffVisualizer = () =>{
    this.setState({visualizerPage: false});
    var canvas = document.getElementsByTagName("canvas");
    canvas[0].parentNode.removeChild(canvas[0]);
  }

  renderVisualizerChoice = () =>{
    return (
        <div>
          <button class="vizButtons" id="dvd" onClick={() => this.setState({visualizerPage: true})}>Visualizers</button>
          {/* <button class="vizButtons" id="dvd" onClick={() => this.turnOffVisualizer()}>Visualizers</button> */}
        </div>
      );
  }

  // renders buttons that show developers helpful buttons w/ API functionality
  renderAPIHelp = () => {

    if (this.state.debugModeActive) {
      return (
        <div style={{'display': 'flex', 'flex-direction': 'column', 'width': '100%', 'justifyContent': 'center', 'alignItems': 'center'}}>
          <button onClick={() => this.setState({'debugModeActive': false})}>Hide API help buttons</button>
          <button onClick={this.api_getNowPlaying}>Get data about what is playing right now</button>
          <button onClick={() => this.api_playSong(["spotify:track:0rRboI6IRuGx56Dq3UdYY4", "spotify:track:6HUFOiTIGCizkemQxhQTao", "spotify:track:6K4t31amVTZDgR3sKmwUJJ"])}>Play a specific song</button>
          <button onClick={() => this.api_pauseSong()}>Pause song</button>
          <button onClick={() => this.api_playSong()}>Resume song</button>
          <button onClick={() => this.api_goToNextSong()}>Next song</button>
          <button onClick={() => this.api_goToPrevSong()}>Prev song</button>
          <button onClick={() => this.api_searchForSong("The less i know the ")}>Example Search: The Less I K</button>
          <button onClick={() => this.props.spotifamAPI.addSong({title: "The Less I Know the Better", artist: "Tame Impala", album: "Currents", duration: "--", uri: "spotify:track:6K4t31amVTZDgR3sKmwUJJ"})}>Add Song</button>
          <button onClick={() => this.props.spotifamAPI.addSong({title: "The Less I Know the Better2", artist: "Tame Impala", album: "Currents", duration: "--", uri: "spotify:track:0rRboI6IRuGx56Dq3UdYY4"})}>Add Song</button>
        </div>
      );
    } else {
      return (
        <div>
          <button>Show API help buttons</button>
        </div>
      );
    }
  }

  // Renders <PlayerPage/>
  render() {
    if(this.props.isMobile) {
      return(
        <div id="MobilePlayerPage">
          <div id="mobile_room_code_container">
            <h3 id="mobile_room_code_text">Room Code: {}{this.props.spotifamAPI.getRoomCode()}</h3>
          </div>
          <div id="mobile_song_content">
            <div id="mobile_currsong_container">
              {this.renderMobileSongDetails()}
            </div>
            <div id="mobile_queue_container">
              {this.renderMobileQueueContainer()}
            </div>
          </div>
          <div id="mobile_controls_container">
            {this.renderSongControls()}
          </div>
        </div>

      );
    } else { //desktop
      if(this.state.visualizerPage === true){
        return (
          <VisualizerPage
            song={this.state.nowPlaying.name}
            art={this.state.nowPlaying.albumArt}
            spotifyAPI={this.spotifyAPI}
            turnOffVisualizer={this.turnOffVisualizer}
          />
        );
      }
      else{
        return (
          <div id="PlayerPage">
            <div id="title_row">
              <img src="./spotifam_logo_outline.png" draggable="false" id="spotifam_title"/>
  
              <h3 id="room_code_text">Room Code: {this.props.spotifamAPI.getRoomCode()}</h3>
            </div>

            <div id="content_container">
              <div id="container_left">
                {this.renderSongDetails()}
                {this.renderVisualizerChoice()}
                <div id="song_controls_container">
                  {this.renderSongControls()}
                </div>
              </div>
              {this.renderRightPanel()}
              {/*this.renderAPIHelp()*/}
            </div>
          </div>
        );
      }
    }
  }
}

export default PlayerPage;