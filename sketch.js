// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

let video;
let poseNet;
let poses = [];
let features = {}
let visuals = []



function setup() {
  createCanvas(600, 600);
 
  video = createCapture(VIDEO);
  video.size(width, height);
  rectMode(CENTER);
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', function(results) {
    poses = results;
  });
  video.hide();
  
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function draw() {
  
 
  //image(video, 0, 0, width, height);
   
  drawKeypoints();
  for (var p in features) {
    if( features.hasOwnProperty(p) ) {
      if(Math.abs(features[p].dx) > 2) {
      	visuals.push(new Visual(features[p].x, features[p].y));
      }
    } 
  }  
  
  visuals.forEach(el => {
  	el.draw();
  })
  
}

class Visual {
	constructor(theX, theY) {
  	this.x = theX;
    this.y = theY;
    this.col = color(random(255),random(255),random(255));
    //this.age = 0;
    this.limit = 100;
  }
  
  draw() {
  	push();
    translate(this.x, this.y);
    fill(255, 0, 0);
    pop();
    visuals.splice(visuals.indexOf(this), 1);
  }
}


function drawKeypoints()  {
 
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      let matchPoints = ['nose'];
      let sep=50;
  for (let i=100; i<width-100; i+=sep){
    for (let j=100; j<height-100; j+=sep){
      if (matchPoints.indexOf(keypoint.part)>-1 && keypoint.score > 0.3) {
        fill(0, 255, 0);
        noStroke();
        
         if (-keypoint.position.x+width>=i && -keypoint.position.x+width<i+sep && keypoint.position.y>=j && keypoint.position.y<j+sep){
        fill(0, 255, 0);
      }
        else{
          
    stroke(0, 255, 0);
   strokeWeight(1);
   noFill();
        }
        if(!(keypoint.part in features)) {
        	features[keypoint.part] = {
          	x:keypoint.position.x,
            y:keypoint.position.y,
            px:keypoint.position.x,
            py:keypoint.position.y,
            dx:0,
            dy:0
          }
        }
        features[keypoint.part].x = keypoint.position.x
        features[keypoint.part].y = keypoint.position.y
        features[keypoint.part].dx = features[keypoint.part].px - keypoint.position.x
        features[keypoint.part].dy = features[keypoint.part].py - keypoint.position.y
        features[keypoint.part].px = keypoint.position.x
        features[keypoint.part].py = keypoint.position.y
      } else {
      	delete features[keypoint.part];
        
      }
        ellipse(i, j, sep, sep);
    }
  }
      stroke(0, 255, 0);
   strokeWeight(1);
   noFill();
    }
  }
}
