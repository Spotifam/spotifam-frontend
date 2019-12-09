import React, { Component } from 'react'
import Sketch from 'react-p5'
 
export default class DVDLogo extends Component {
 

  constructor(props) {
    super(props);
    this.state = {
      song:'',
      art:'',
      nowPlaying: {
        name: '',
        artist: '',
        progress_ms: 0,
        albumArt: '',
      }
    };
  }

  x;
  y;

  size;

  speed;
  xspeed;
  yspeed;

  r;
  g;
  b;

  bpm;

  direction;
  distance;

  img;

  setup = (p5, canvasParentRef) => {
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(canvasParentRef)
    this.x = 300;
    this.y = 100;
    this.xspeed = 5;
    this.yspeed = 5;
    this.bpm = 75;
    this.r = 100;
    this.g = 100;
    this.b = 100;
    this.direction = "SW";
    this.distance = "0";
    this.img = p5.loadImage(this.props.art);
    this.size = window.innerWidth/8;


  }

  pickColor = () => {
    this.r = Math.random()*(256-100)+100;
    this.g = Math.random()*(256-100)+100;
    this.b = Math.random()*(256-100)+100;
  }

  changeDirection = () => {
    if((this.x===window.innerWidth-this.size && this.yspeed<0) || (this.y===window.innerHeight-this.size && this.xspeed<0)){
        this.direction = "NW"
      }
      else if((this.x===window.innerWidth-this.size && this.yspeed>0) || (this.y===0 && this.xspeed<0)){
        this.direction = "SW"
      }
      else if((this.y===window.innerHeight-this.size && this.xspeed>0) || (this.x===0 && this.yspeed<0)){
        this.direction = "NE"
      }
      else if((this.x===0 && this.yspeed>0) || (this.y===0 && this.xspeed>0)){
        this.direction = "SE"
      }
  }

  calcDistance = () => {
    if(this.direction==="NE"){
      if(this.y<(window.innerWidth-this.size-this.x)){
        this.distance = this.y/.70710;
      }else{
        this.distance = (window.innerWidth-this.size-this.x)/.70710;
      }
    }
    else if(this.direction==="SE"){
      if((window.innerWidth-this.size-this.x)<(400-this.y)){
        this.distance = (window.innerWidth-this.size-this.x)/.70710;
      }else{
        this.distance = (window.innerHeight-this.size-this.y)/.70710;
      }
    }
    else if(this.direction==="SW"){
      if(this.x<(window.innerHeight-this.size-this.y)){
        this.distance = this.x/.70710;
      }else{
        this.distance = (window.innerHeight-this.size-this.y)/.70710;
      }
    }
    else if(this.direction==="NW"){
      if(this.x<this.y){
        this.distance = this.x/.70710;
      }else{
        this.distance = this.y/.70710;
      }
    }
  }

  calcSpeed = () => {
    this.speed = ((this.distance*this.bpm)/3600);
    if(this.xspeed<0 && this.yspeed<0){
      this.xspeed = -((this.speed/.70710*4/7)*.974/2);
      this.yspeed = this.xspeed;
    }
    else if(this.xspeed<0 && this.yspeed>0){
      this.xspeed = -((this.speed/.70710*4/7)*.974/2);
      this.yspeed = -this.xspeed;
    }
    else if(this.xspeed>0 && this.yspeed<0){
      this.xspeed = ((this.speed/.70710*4/7)*.974/2);
      this.yspeed = -this.xspeed;
    }
    else{
      this.xspeed = ((this.speed/.70710*4/7)*.974/2);
      this.yspeed = this.xspeed;
    }
  }

  draw = p5 => {

    p5.background(2);
    p5.fill(0);
    p5.textSize(42);
    p5.textFont('Georgia');
    //p5.text("BPM: " + this.bpm, 300, 30);
    //p5.text("Song: ", 300, 70);

    p5.textSize(window.innerHeight/7.5);
    p5.fill(this.r,this.g,this.b);
    p5.textAlign(p5.CENTER);
    p5.text(this.props.song,window.innerWidth/2,window.innerHeight/2);


    p5.image(this.img, this.x, this.y, this.size, this.size);

    


    this.x = this.x + this.xspeed;
    this.y = this.y + this.yspeed;
    
    if(this.x+this.size >= window.innerWidth){
      this.x = window.innerWidth - this.size;
      this.changeDirection();
      this.calcDistance();
      this.pickColor();
      this.calcSpeed();
      this.xspeed = -this.xspeed; 
      
    }
    else if(this.x <= 0){
      this.x = 0;
      this.changeDirection();
      this.calcDistance();
      this.pickColor();
      this.calcSpeed();
      this.xspeed = -this.xspeed; 
      
    }
    else if(this.y+this.size >= window.innerHeight){
      this.y = window.innerHeight - this.size;
      this.changeDirection();
      this.calcDistance();
      this.pickColor();
      this.calcSpeed();
      this.yspeed = -this.yspeed; 
      
    }
    else if(this.y <= 0){
      this.y = 0;
      this.changeDirection();
      this.calcDistance();
      this.pickColor();
      this.calcSpeed();
      this.yspeed = -this.yspeed; 
      
    }
  }
 
  render() {
    return (
      <div class="sketch">
        <a href="#" id="backButton" onClick={() => this.props.turnOffVisualizer()}>Back to Spotifam Queue</a>
        <Sketch setup={this.setup} draw={this.draw}/>
      </div>
    );
  }
}