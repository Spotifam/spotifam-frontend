import React, { Component } from 'react'
import Sketch from 'react-p5'
 
export default class DVDLogo extends Component {
 
  x;
  y;

  speed;
  xspeed;
  yspeed;

  r;
  g;
  b;

  bpm;

  direction;
  distance;

  setup = (p5, canvasParentRef) => {
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(canvasParentRef)
    this.x = 0;
    this.y = 150;
    this.xspeed = 5;
    this.yspeed = 5;
    this.bpm = 75;
    this.r = 100;
    this.g = 100;
    this.b = 100;
    this.direction = "SE";
    this.distance = "0";

  }

  pickColor = () => {
    this.r = Math.random()*(256-100)+100;
    this.g = Math.random()*(256-100)+100;
    this.b = Math.random()*(256-100)+100;
  }

  changeDirection = () => {
    if((this.x===window.innerWidth-200 && this.yspeed<0) || (this.y===window.innerHeight-200 && this.xspeed<0)){
        this.direction = "NW"
      }
      else if((this.x===window.innerWidth-200 && this.yspeed>0) || (this.y===0 && this.xspeed<0)){
        this.direction = "SW"
      }
      else if((this.y===window.innerHeight-200 && this.xspeed>0) || (this.x===0 && this.yspeed<0)){
        this.direction = "NE"
      }
      else if((this.x===0 && this.yspeed>0) || (this.y===0 && this.xspeed>0)){
        this.direction = "SE"
      }
  }

  calcDistance = () => {
    if(this.direction==="NE"){
      if(this.y<(window.innerWidth-200-this.x)){
        this.distance = this.y/.70710;
      }else{
        this.distance = (window.innerWidth-200-this.x)/.70710;
      }
    }
    else if(this.direction==="SE"){
      if((window.innerWidth-200-this.x)<(400-this.y)){
        this.distance = (window.innerWidth-200-this.x)/.70710;
      }else{
        this.distance = (window.innerHeight-200-this.y)/.70710;
      }
    }
    else if(this.direction==="SW"){
      if(this.x<(window.innerHeight-200-this.y)){
        this.distance = this.x/.70710;
      }else{
        this.distance = (window.innerHeight-200-this.y)/.70710;
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
      this.xspeed = -((this.speed/.70710*4/7)*.974);
      this.yspeed = this.xspeed;
    }
    else if(this.xspeed<0 && this.yspeed>0){
      this.xspeed = -((this.speed/.70710*4/7)*.974);
      this.yspeed = -this.xspeed;
    }
    else if(this.xspeed>0 && this.yspeed<0){
      this.xspeed = ((this.speed/.70710*4/7)*.974);
      this.yspeed = -this.xspeed;
    }
    else{
      this.xspeed = ((this.speed/.70710*4/7)*.974);
      this.yspeed = this.xspeed;
    }
  }

  draw = p5 => {

    p5.background(220);
    p5.fill(0);
    p5.textSize(42);
    p5.textFont('Georgia');
    p5.text(this.direction, 12, 30);
    p5.text(this.distance, 12, 70);
    p5.text("BPM: " + this.bpm, 12, 110);


    p5.fill(this.r,this.g,this.b);
    p5.rect(this.x, this.y, 200, 200);
    


    this.x = this.x + this.xspeed;
    this.y = this.y + this.yspeed;
    
    if(this.x+200 >= window.innerWidth){
      this.x = window.innerWidth - 200;
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
    else if(this.y+200 >= window.innerHeight){
      this.y = window.innerHeight - 200;
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
        <Sketch setup={this.setup} draw={this.draw}/>
      </div>
    );
  }
}