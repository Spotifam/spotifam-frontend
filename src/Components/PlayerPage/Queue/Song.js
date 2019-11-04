/*
  <Song />

  Description:
    - <Song /> is an html row element that displays a song:
      + Title
      + Artist
      + Album
      + Duration

  Props:
    + VARIABLES
    - id [str]
    - index [int] <Song/>'s current position in PlayerPage.songs
    - song = {
              title:    [str],
              artist:   [str],
              album:    [str],
              duration: [str]
             }
    - current [str] either contains "currentSong" or "" [nullstr] and gets
      added to each <Song/>'s className

    + FUNCTIONS
    - onQueueDrop(song: [obj], drag_index: [int], drop_index: [int], position: [str])
      Handles all drag and drop events for moving songs in the queue


  Children:
    - None

*/

import React from 'react';
import "./Song.css";
import { ItemTypes } from './Constants.js';
import { useDrag, useDrop } from 'react-dnd';

function Song (props) {
  
  // Drag and Drop -------------------------------------------------------------

  // Handles dragging of song row element
  const [{isDragging}, drag] = useDrag({
    item: { type: ItemTypes.SONG, song: props.song, index: props.index},
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  // Handles "above" dropzone
  const [{isAbove}, drop_above] = useDrop({
    accept: ItemTypes.SONG,
    collect: monitor => ({
      isAbove: !!monitor.isOver(),
    }),
    drop: (item) => props.onQueueDrop(item.song, item.index, props.index, "above"),
  })

  // Handles "below" dropzone
  const [{isBelow}, drop_below] = useDrop({
    accept: ItemTypes.SONG,
    collect: monitor => ({
      isBelow: !!monitor.isOver(),
    }),
    drop: (item) => props.onQueueDrop(item.song, item.index, props.index, "below"),
  })

  // render --------------------------------------------------------------------
  return (
    <tr
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor:           'ns-resize',
      }}

      id={props.id}
      className={props.current}
    >
      <td>{ props.song.title    }</td>
      <td>{ props.song.artist   }</td>
      <td>{ props.song.album    }</td>
      <td>{ props.song.duration }</td>

      {/* 
          DROPZONE EXPLANATION:

          Elements under dropzones will be used for deciding where
          the user intends to drop a song. The divs take up the top and
          bottom 50% (respectively) of each row. When the user drops on
          "above" it will insert above the row and vice versa for "below". 
          For clarification, inspect element on "dropzones"
      */}

      <div className="dropzones"
        style={{
          borderTop:      isAbove ? "2px solid #1DB954" : "",
          borderBottom:   isBelow ? "2px solid #1DB954" : "",
          zIndex:              (isAbove || isBelow) ? 10 : 0,
        }}
      >
        <div
          ref={drop_above}
          className="above"
        >a</div>
        <div
          ref={drop_below}
          className="below"
        >b</div>
      </div>
    </tr>
  );
}

export default Song;
