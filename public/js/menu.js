var secElapsed = 0;
var currentScreen = "intro";
var currentText = "welcome to upstate new york.";
var currentBackground = "stars";
var textTime = 4;

var Y_AXIS = 1;
var c1;
var c2;
var inc = 0.005;
var start = 0;

function run() {

  textAlign(CENTER);
  textFont('Andale Mono');
  noStroke();
  fill(255);
  textSize(12);

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
    c2 = color(4, 25, 59);

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

function drawInstructions() {
  currentScreen = "instructions";
  // black background
  noStroke();
  fill(0);
  rect(0, 0, width, height);

  fill(255);
  textAlign(LEFT);
  text("instructions:\n\nsmile!\ndon't move!\nand perhaps they will let you get away ...\n\n\n\npress any key to start.", width/2 - 200, windowHeight/2 - 100);
}

function drawIntro() {
  noStroke();
  fill(0);
  rect(0,0,width, height);

  textAlign(CENTER);
  textFont('Andale Mono');
  noStroke();
  fill(255);
  textSize(12);

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
  if (keyCode == 32) {
    currentScreen = "game";
    return false;
  }
}
