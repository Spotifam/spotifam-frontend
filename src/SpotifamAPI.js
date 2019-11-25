import generate from "@babel/generator"

/* SPOTIFAM API HELPER

    Endpoints:
    - /createroom/
    - /getqueue/
    - /addsong/
    - /search/
    - /


*/
// For production
//var BASE_URL = "http://spotifam.com"

//const BASE_URL = (window.location.hostname === "localhost") ? "http://127.0.0.1:5000" : "https://api.spotifam.com";
const BASE_URL = "https://api.spotifam.com";

class SpotifamAPI {

    constructor () {
        this.room_code ="";
        this.auth_tok = "";
      }

    // GETTERS AND SETTERS --------------------------------------------

    setAuthCode (auth_tok) {
        this.auth_tok = auth_tok;
    }

    getAuthCode () {
        return this.auth_tok;
    }

    getRoomCode () {
        return this.room_code;
    }

    setRoomCode(roomCode) {
      this.room_code = roomCode;
    }


    // HELPER FUNCTIONS -----------------------------------------------
    parseSong(song) {
        /*
            Given a track from the spotifamAPI.search function, parse
            it into the following object.
        */
        return {
          title:         song.name,
          artist:        song.artists[0].name,
          album:         song.album.name,
          albumArt:      song.album.images[0]['url'],
          duration:      ("" + song.duration_ms),
          uri:           song.uri,
        }
      }

    // ENDPOINT CALLS -------------------------------------------------

    // Create a room on the backend with users credentials
    async createRoom () {
        var create_room_url = BASE_URL + "/createroom?auth_tok=" + this.auth_tok;
        console.log(create_room_url);
        let response = await fetch(create_room_url, {
            mode: 'cors',
        })
            .then(response => response.json())
            .catch(error => console.error(error));

        this.room_code = response['room'];
        return response;
    }

    // Update queue for room
    async getQueue () {
        var getqueue_url = BASE_URL + "/getqueue/?room_code=" + this.room_code;
        let response = await fetch(getqueue_url, {
            mode: "cors",
        })
            .then(function (response) { console.log(response); return response;})
            .then(response => response.json())
            .catch(error => console.error(error));
        return response;
    }

    // song object is of same format as from parseSong()
    async addSong (song) {
        var addsong_url = BASE_URL + "/addsong/";

        let response = await fetch(addsong_url, {
            method: 'POST',
            mode: "cors",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                song: song,
                room: this.room_code
            }),
          });

        console.log(response);
        return response;
    }

    async updateQueue (queue) {
        var addsong_url = BASE_URL + "/updatequeue/";

        let response = await fetch(addsong_url, {
            method: 'POST',
            mode: "cors",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                queue: queue,
                room: this.room_code
            }),
          });

        console.log(response);
        return response;
    }

    async search (query, roomCode = false) {
        let code = this.room_code;
        if (roomCode !== false) {
          code = roomCode;
        }
        var search_url = BASE_URL + "/search?query=" + query + "&room=" + code;
        let response = await fetch(search_url, {
            mode: 'cors',
        })
            .then(response => response.json())
            .catch(error => console.error(error));

        console.log(response);
        return response;
    }

    async checkIfRoomExists (roomCode) {
      var room_url = BASE_URL + "/checkroom?room=" + roomCode;
      let response = await fetch(room_url, {
            mode: 'cors',
        })
          .then(response => response.json())
          .catch(error => console.error(error));

      console.log(response);
      return response;
    }

}

export default SpotifamAPI;
