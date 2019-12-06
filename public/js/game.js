var positions; // face tracking points

var moving; // bool indicating whether or not user is moving

var smiling; // bool indicating whether or not user is smiling
var smilingThreshold = 0.85; // if exceeded, user is smiling

var poseTime = 100; // time posing to get rid of features
var poseTimeRemaining = poseTime; // pose time countdown
var posing; // boolean indicating whether or not user is posing

var captureScale = 0.99;
var blackTintLevel = 100;

var stopped = false;

// returns true if motion is detected, false if otherwise
function checkMovement() {
  motionCount = 0;
  motionThreshold = 100;

  video.loadPixels();
  pFrame.loadPixels();

  for (let y = 0; y < video.height; y++) {
    for (let x = 0; x < video.width; x++) {
      var index = (x + y * video.width) * 4
      let pr = pFrame.pixels[index + 0];
      let pg = pFrame.pixels[index + 1];
      let pb = pFrame.pixels[index + 2];
      let pbright = (pr + pg + pb) / 3;

      let r = video.pixels[index + 0];
      let g = video.pixels[index + 1];
      let b = video.pixels[index + 2];
      let bright = (r + g + b) / 3;

      var diff = dist(r, g, b, pr, pg, pb);
			if (diff < 20) {
        fill(bright);
      } else {
        fill(255, 0, 0);
        motionCount += 1;
      }
    }
  }

  pFrame.copy(video, 0, 0, video.width, video.height, 0, 0, video.width, video.height);

  moving = motionCount > motionThreshold;
}

function showFacePoints() {
  strokeWeight(6);
  stroke(255);

  // show mouth endpoints
  point(positions[44][0], positions[44][1]);
  point(positions[50][0], positions[50][1]);

  // show eye center points
  point(positions[27][0], positions[27][1]);
  point(positions[32][0], positions[32][1]);

  // show tip of nose point
  point(positions[62][0], positions[62][1]);

  // show face edges
  point(positions[1][0], positions[1][1]);
  point(positions[13][0], positions[13][1]);
  point(positions[7][0], positions[7][1]);
}

function showDebugInfo() {
  push();
  translate(50,50);
  noStroke();
  fill(0);
  textSize(12);
  textFont('Andale mono');
  textAlign(LEFT);

  // background
  rect(0,0,200,150);
  fill(255);
  // text("debug info", 20, 30);

  // movement
  var moveText = "moving: " + moving;
  text(moveText, 20, 30);

  // smile
  var smilingText = "smiling: " + smiling;
  text(smilingText, 20, 50);

  // timer
  var timeText = "time remaining: " + int(poseTimeRemaining / 10);
  text(timeText, 20, 80);

  // life bar
  var lifeText = "life bar:";
  text(lifeText, 20, 100);

  rectMode(CORNER);
  fill(255);
  stroke(255);
  rect(20, 110, 160, 10); //life bar background

  if (captureScale < 0.5) {
    fill(255,0,0);
  } else {
    fill(0);
  }
  rect(20, 110, 200 * (captureScale - 0.2), 10); // life bar
  pop();
}

function checkSmile() {
  // calculate smile

  // smiles are calculated by comparing the ratio of the distance between
  // the middle of the left and right eyes with the distance of the left and
  // right corners of the mouth

  var mouthLeft = createVector(positions[44][0], positions[44][1]);
  var mouthRight = createVector(positions[50][0], positions[50][1]);
  var mouthDist = mouthLeft.dist(mouthRight);

  var eyeLeft = createVector(positions[27][0], positions[27][1]);
  var eyeRight = createVector(positions[32][0], positions[32][1]);
  var eyeDist = eyeLeft.dist(eyeRight);

  smiling = (mouthDist / eyeDist) > smilingThreshold;
}

function attachFeatures() {
  imageMode(CENTER);
  const eyeScale = 1.8;
  const noseScale = 1.2;
  const mouthScale = 1.4;

  // left eye
  // calculate size of left eye
  var leftEyeW = (positions[25][0] - positions[23][0]) * eyeScale;
  var leftEyeH = (positions[26][1] - positions[24][1]) * eyeScale;
  image(leftEyeImg, positions[27][0], positions[27][1], leftEyeW, leftEyeH);

  // right eye
  // calculate size of right eye
  var rightEyeW = (positions[28][0] - positions[30][0]) * eyeScale;
  var rightEyeH = (positions[31][1] - positions[29][1]) * eyeScale;
  image(rightEyeImg, positions[32][0], positions[32][1], rightEyeW, rightEyeH);

  // nose
  // calculate size of nose
  var noseW = (positions[39][0] - positions[35][0]);
  var noseH = (positions[37][1] - positions[33][1]);
  var noseX = positions[35][0] + (noseW / 2);
  var noseY = positions[33][1] + (noseH / 2);
  image(noseImg, noseX, noseY, noseW * noseScale, noseH * noseScale);

  // mouth
  // calculate size of mouth
  var mouthW = (positions[50][0] - positions[44][0]);
  var mouthH = (positions[53][1] - positions[48][1]);
  var mouthX = positions[44][0] + mouthW / 2;
  var mouthY = positions[46][1] + mouthH / 2;
  image(mouthImg, mouthX, mouthY, mouthW * mouthScale, mouthH * mouthScale);
}

function checkPose() {
  if (frameCount % 3 == 0) {

    if (!moving && smiling && poseTimeRemaining > 0) {
      poseTimeRemaining--;
    }
    if (moving || !smiling && captureScale > 0.2) {
      poseTimeRemaining = poseTime;
      posing = false;
      blackTintLevel -= 1;
      captureScale -= 0.01;
    }
    if (poseTimeRemaining == 0) {
      posing = true;
      if (captureScale < 1) {
        captureScale += 0.003;
      }
    }
  }
}

function showGameOver() {
  noLoop();
  pop();
  textAlign(CENTER);
  noStroke();
  fill(255);
  textSize(12);
  text("you failed to escape the sunken place. they have your body now.",
        width/2,
        windowHeight/2);
}

function showGameWon() {
  noLoop();
  pop();
  textAlign(CENTER);
  noStroke();
  fill(255);
  textSize(12);
  text("you escaped the sunken place with your own face and body. congrats.", width/2, windowHeight/2);
}

// main game
// tracks face, attachs features, checks for posing, etc.
function playGame() {
  noFill();
  noStroke();
  push();

  // horizontally flip capture so we look good lol
  translate(capture.width, 0);
  scale(-1.0,1.0);
  imageMode(CENTER);
  tint(255, blackTintLevel);
  tint(54, 69, 150, 50);

  if (!moving && smiling) {
    noTint();
  }

  console.log(captureScale);
  scale(captureScale, captureScale);
  // image(capture, width/2, height/2, w * captureScale, h * captureScale);
  image(capture, width/2, height/2, w, h);

  positions = tracker.getCurrentPosition();

  if (positions.length > 0) {

    checkMovement();
    checkSmile();
    checkPose();

    if (!posing) { // if user is not posing, add features
      attachFeatures();
    }

    if (captureScale < 0.20) {
      showGameOver();
    } else if (captureScale >= 1) {
      showGameWon();
    }

    if (debug) {
      pop();
      showDebugInfo();
    }
  }
}
