var secElapsed = 0;
// var currentScreen = "intro";
var currentScreen = "title";
var currentText = "welcome to upstate new york.";
var currentBackground = "stars";
var textTime = 4;

var Y_AXIS = 1;
var c1;
var c2;
var inc = 0.005;
var start = 0;

var paused = false;

//////////////////////////////////////////////////////////////////////////////

// get out text
function TextObj() {
  this.x = random(5, windowWidth - 5);
  this.y = 0;
  this.speed = random(2,8);
  this.velocity = 1;
  // this.color = color(random(0,255), random(0,255), random(0,255));
  this.color = color(70);
  this.size = 12;
  this.text = "get out";

  this.display = function() {
    textSize(this.size);
    fill(this.color);
    text(this.text, this.x, this.y);
  }

  this.move = function() {
    if (this.y < 0 || this.y > windowHeight) {
      this.velocity *= -1;
    }
    this.y = this.y + this.velocity * this.speed;
  }
}

function drawTexts() {
  // twinkling stars
  for (var i =0; i<texts.length; i++) {
    texts[i].display();
    texts[i].move();
  }
}

// creates gradients
function setGradient(x, y, w, h, c1, c2, axis) {
	noFill();
	if (axis == Y_AXIS) {  // Top to bottom gradient
   	for (var i = y; i <= y+h; i++) {
    	var inter = map(i, y, y+h, 0, 1);
    	var c = lerpColor(c1, c2, inter);
    	stroke(c);
    	line(x, i, x+w, i);
   	}
 	}
}

// star
function Star() {
	this.x = random(5, windowWidth - 5);
	this.y = random(10, (windowHeight - 10) * 0.6);
	this.r = random(2,5);

	this.display = function() {
		stroke(1, 45, 79);
		fill(210, 233, 242);
		this.rc = constrain(this.r, 0, 9);
    ellipse(this.x, this.y, this.rc, this.rc);
  };

	this.twinkle = function() {
		if (this.r < 3) {
			this.r += random(-.5,1.5);
		} else if (this.r >= 3 && this.r < 6) {
			this.r += random(-1,1);
		} else if (this.r >=6 && this.r <=9) {
			this.r += random(-1.5,0.5);
		}
	}

  this.drift = function() {
    speed = random(0,0.5);
    this.x -= speed;
  }
}

function drawStars() {
  // twinkling stars
  for (var i =0; i<stars.length; i++) {
    stars[i].display();
    stars[i].twinkle();
    stars[i].drift();
  }
}

function drawBackground(bg) {
  if (bg == "stars") {

    c1 = color(0);
    c2 = color(9, 59, 202);

    // gradient background
    setGradient(0, 0, windowWidth, windowHeight, c1, c2, Y_AXIS);

    drawStars();

    // hills
    fill(0);
    noStroke();
    beginShape();
    var xoff = start;

    for (var x = 0; x < windowWidth; x++) {
      var y = noise(xoff) * windowHeight * 0.6;
      vertex(x,y);
      xoff += inc;
    }

    vertex(windowWidth, windowHeight);
    vertex(0, windowHeight);
    endShape();

    start += inc;
    fill(255);

  }
}

//////////////////////////////////////////////////////////////////////////////

function run() {

  textAlign(CENTER);
  textFont('Andale Mono');
  noStroke();
  fill(255);
  textSize(15);

  if (currentScreen == "title") {
    drawTitle();
  }

  if (currentScreen == "intro") {
    if (secElapsed < (textTime * 3) + 2) {
      drawIntro();
    } else {
      currentScreen = "instructions";
      drawInstructions();
    }
  }

  if (currentScreen == "game") {
    playGame();
  }
}

function drawTitle() {
  currentScreen = "title";

  var textCount = 0;
  var t = "get out";
  var tBuffer = 30;

  noStroke();
  fill(0);
  rect(0, 0, width, height);

  drawTexts();

  fill(255);
  textAlign(CENTER);
  textSize(15);
  text("click to start", width/2, windowHeight/2);

  // if (frameCount % 30 == 0) {
  //   while (textCount < 50) {
  //     fill(random(0,255), random(0,255), random(0,255));
  //     var tX = int(random(tBuffer, windowWidth - tBuffer));
  //     var tY = int(random(tBuffer, windowHeight - tBuffer));
  //     text(t, tX, tY);
  //     textCount += 1;
  //   }
  // }
}

function drawInstructions() {
  currentScreen = "instructions";

  // black background
  noStroke();
  fill(0);
  rect(0, 0, width, height);

  fill(255);
  textAlign(LEFT);
  text("instructions:\n\nsmile!\ndon't move!\nand perhaps they will let you get away ...\n\n\n\npress space to start.", width/2 - 200, windowHeight/2 - 100);
}

function drawIntro() {

  noStroke();
  fill(0);
  rect(0,0,width, height);

  textAlign(CENTER);
  textFont('Andale Mono');
  noStroke();
  fill(255);
  textSize(15);

  if (frameCount % 60 == 0) {
    secElapsed += 1;

    if (secElapsed <= textTime) {
      currentText = "welcome to upstate new york.";
      currentBackground = "stars";
    }

    if (secElapsed > textTime && secElapsed <= textTime * 2) {
      currentText = "you're spending the weekend with your significant other";
    }

    if (secElapsed > textTime * 2 && secElapsed <= textTime * 3) {
      currentText = "but something has gone terribly wrong ...";
    }

  }

  if (currentScreen == "intro") {
    drawBackground(currentBackground);
    text(currentText, width/2, windowHeight/2);
  }

}

function keyPressed() {
  if (keyCode == 32) { // press space to start game
    currentScreen = "game";
  }
  if (keyCode == 82) { // press 'r' to restart
    loop();
    console.log("restarting...");
    currentScreen = "title";
  }
  if (keyCode == 80) { // press 'p' to pause
    var w = 5;
    var h = 15;
    var pause1;
    var pause2;

    paused = !paused;

    if (paused) {
      console.log("pause");
      fill(255);
      translate(0,0);
      pause1 = rect(windowWidth - 50 , 50, w, h);
      pause2 = rect(windowWidth - 40 , 50, w, h);
      noLoop();
    } else {
      console.log("play");
      pause1 = null;
      pause2 = null;
      loop();
    }
  }
  return false;
}

function mousePressed() {
  currentScreen = "intro";
  return false;
}
