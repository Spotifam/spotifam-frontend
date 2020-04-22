/**
 * Manages all components within the <PlayerPage/>.
 * The <PlayerPage/> operates as the host user's way to interact with the
 * queue and playback. It serves as the main device where music will actually
 * play from.
 * 
 * @file <PlayerPage/>
 * 
 * Props:
 * @param {Object} spotifyAPI wrapper for the Spotify API (already has user 
 *                            logged in). It follows definitions from
 *                            https://github.com/jmperez/spotify-web-api-js
 * 
 * Child Components:
 * @see GettingStarted
 * @see MobileRoom
 * @see Queue
 * @see MobileQueue
 * @see Visualizer
 * @see SongDetails
 * @see MobileSongDetails
 * @see SongControls
 * @see Alert
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
import GettingStarted from "./GettingStarted/GettingStarted.js"


// =============================================================================
// Constants
// =============================================================================

const __refreshLimit = 1; // for how often to refresh spotify info (in seconds)


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
      songs: [],
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

    /* 
      We want the <Song/> component to be able to edit PlayerPage.songs so we 
      bind the state of this function to PlayerPage.
    */
    this.onQueueDrop = this.onQueueDrop.bind(this);
  }

  // ===========================================================================
  // React Component Lifecycle Functions
  // ===========================================================================

  componentDidMount() {
    this.createSpotifyAPITimer()
  }

  componentWillUnmount() {
    this.deleteSpotifyAPITimer()
  }


  // ===========================================================================
  // Timer
  // ===========================================================================
  /*
    functions that involve a timer, including updating state info about the 
    current playing song.
  */

  createSpotifyAPITimer() {
    /**
     * Create a timer that manages recurring calls to the Spotify API.
     * The timer runs on an infinite loop that tells calls to the Spotify API
     * when they should fire.
     */
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  deleteSpotifyAPITimer() {
    /**
     * Deletes the timer that refreshes information from the Spotify API.
     * Deletion is handled when exiting the app to make sure there are no
     * dangling pointers.
     */
    clearInterval(this.timerID);
  }

  tick() {
    /**
     * Manages recurring calls to the Spotify API.
     * Everytime the secondsPassed exceeds the __refreshLimit we need to
     * grab new information from Spotify. Calls are made every x seconds set by
     * the __refreshLimit.
     * 
     * @see createSpotifyAPITimer
     * @see __refreshLimit
     */
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


  // ===========================================================================
  // Spotify API Interactions
  // ===========================================================================
  /*
    Functions for interacting with Spotify API
      - api_getNowPlaying():    Returns information about the current song
      - api_playSong():         Plays the currently selected song
      - api_pauseSong():        Pauses the currently active spotify player
      - api_goToNextSong():     Skips to the next song
      - api_goToPrevSong():     Goes to the previously played song
      - api_searchForSong():    Searches for a track with a specified name
      - api_setDevice():        Sets the current device to start playback on
  */


  // gets data about the song that is playing right now
  // right now, this just creates an alert -> eventually this should set state
  api_getNowPlaying = () => {
    /**
     * Gets data about the song that is playing right now.
     * Used only for testing purposes.
     * @link https://spoti.fi/2XTHkaR
     * @deprecated
     * 
     * @see api_getSongDetails
     */
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
    /**
     * Gets data about the song that is playing right now.
     * Sets state with the current playback information.
     * @link https://spoti.fi/2XTHkaR
     */
    this.props.spotifyAPI.getMyCurrentPlaybackState()
    .then((response) => {
      
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
    }).catch(function(err) {
      console.log(err);
    });
  }

  api_playSong = (songID = null) => {
    /**
     * Plays a song with a given songID.
     * songID can be one of 3 options:
     *    1) null             : Plays whatever song Spotify has selected
     *    2) trackID          : Plays the song with the given ID
     *    3) list of trackIDs : Plays first song in the list, add rest to queue
     * a Spotify ID comes in the format of "spotify:track:0ZiGRciYMWrDvCPNM0T21o".
     * @link https://spoti.fi/3apvIio
     */

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
    if (playObject.uris[0] === this.state.nowPlaying.uri 
        | this.state.songs.length === 0) {
      this.props.spotifyAPI.play();
    } else {
      this.props.spotifyAPI.play(playObject);
    }
    
    this.setState({paused_by_user: false});
  }

  api_pauseSong = () => {
    /**
     * Pauses the currently active Spotify player.
     * We also handle if the user paused with Spotifam. Because of the way the
     * Spotify API works, to make autoplay work we wait for a song to finish and
     * skip to the next.
     * @link https://spoti.fi/2znAIay
     * 
     * @see api_handleAutoPlay
     */
    this.props.spotifyAPI.pause();
    this.setState({paused_by_user: true});
  }

  api_goToNextSong = () => {
    /**
     * Skips to the next song.
     * If there isn't a song after the current one the first song in the queue
     * is played.
     * @link https://spoti.fi/2XVSEDf
     */
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

  api_goToPrevSong = () => {
    /**
     * Skips to the previous song or the start of the current.
     * If the user is more than 5 seconds into the song we restart it, otherwise
     * we go to the previous song in the queue.
     * @link https://spoti.fi/3bwxKhY
     */
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
    /**
     * Performs a search for a song.
     * Only used in testing capacity.
     * @link https://spoti.fi/3eHlfST
     * @deprecated
     */
    let resultTypes = ["track"];
    this.props.spotifyAPI.search(query, resultTypes)
    .then((result) => {
      alert('check console for result');
      console.log(result);
    }).catch(function(err) {
      console.log(err);
    });
  }


  // ===========================================================================
  // Spotify API Helpers
  // ===========================================================================

  api_setDevice = () => {
    /**
     * Sets the device to the Spotifam Web Player.
     * Users can choose to switch to other players within any Spotify App.
     */
    
    if (window.WebPlayer) {
      this.setState({current_device_id: window.WebPlayer._options.id});
    }
  }

  api_handleAutoPlay = () => {
    /**
     * Handles automatically playing the next song in the queue.
     * 
     */
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


  // ===========================================================================
  // Queue Functions
  // ===========================================================================

  onQueueDrop(song, drag_index, drop_index, pos) {
    /**
     * Handles the functionality of dragging/dropping songs.
     * When a user picks up song to rearrange it is removed from the queue and 
     * then added in their indicated position. To find if the user wants to move 
     * a song below or above another in the queue we use two dropzones. Above is 
     * when the song is dropped in the top 50% of a <Song/> component and below 
     * in the other 50%.
     * 
     * @see Queue
     * @see Song
     */

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
    } else if (drag_index === drop_index + offset) {
      // If a song doesn't change place do nothing
    } else if (drag_index < this.state.current_song 
               && drop_index >= this.state.current_song) {
      this.setState({current_song: this.state.current_song - 1});
    } else if (drag_index > this.state.current_song 
               && drop_index <= this.state.current_song) {
      this.setState({current_song: this.state.current_song + 1});
    }

    // Update queue changes on the server
    this.props.spotifamAPI.updateQueue(songs);

    // Update songs array
    this.setState({songs: songs});
  }


  // ===========================================================================
  // Render
  // ===========================================================================

  renderQueue = () => {
    /**
     * Renders the <Queue/>
     * @see Queue
     */
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

  renderSongDetails = () => {
    /**
     * Renders <SongDetails/> component.
     * Displays the album art and the name of the currently playing song.
     */
    if (this.state.nowPlaying.name != '') {
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

  renderSongControls = () => {
    /**
     * Renders the <SongControls/> component.
     * Controls include anything that lets the user change the playback of
     * the current song.
     */
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
    /**
     * Renders the right panel in the <PlayerPage/>.
     * The right panel serves multiple functions for the user. Anything that 
     * should extend functionality of song/queue management should be rendered 
     * in this panel. Right now, adding a song on a desktop room uses the mobile 
     * page functionality.
     * 
     * @see MobileRoom
     */
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
    } else if (this.state.songs.length === 0) {
      return(
        <div id="container_right">
          <GettingStarted 
            room_code={this.props.spotifamAPI.getRoomCode()}
          />
          <button id="ToggleSearch" onClick={() => this.setState({searching: true})}>
            <div id="ToggleSearchIcon">+</div>
            <div id="ToggleSearchText">Add Songs</div>
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

  turnOffVisualizer = () => {
    /**
     * Removes the visualizer from the page.
     */
    this.setState({visualizerPage: false});
    var canvas = document.getElementsByTagName("canvas");
    canvas[0].parentNode.removeChild(canvas[0]);
  }

  renderVisualizerChoice = () => {
    /**
     * Shows the options page for multiple types of visualizers.
     */
    return (
        <div>
          <button class="vizButtons" id="dvd" onClick={() => this.setState({visualizerPage: true})}>Visualizers</button>
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

  render() {
    /**
     * Renders <PlayerPage/>.
     * First decides if the user is on a mobile or desktop device. If the user 
     * is on the desktop, we route them to either the visualizer page, if it is 
     * enabled, or the song management page (queue, controls, etc).
     */
    if (this.props.isMobile) {
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
      if (this.state.visualizerPage === true) {
        return (
          <VisualizerPage
            song={this.state.nowPlaying.name}
            art={this.state.nowPlaying.albumArt}
            spotifyAPI={this.spotifyAPI}
            turnOffVisualizer={this.turnOffVisualizer}
          />
        );
      } else {
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
            </div>
          </div>
        );
      }
    }
  }
}

export default PlayerPage;
