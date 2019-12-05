// motion detection variables
var video;
var scalar = 10;
var pFrame;
var debug = true;

// face tracking variables
var capture;
var tracker

var canvasDiv = document.getElementById("canvas");
var w = canvasDiv.offsetWidth;
var h = canvasDiv.offsetHeight;

// feature variables
var leftEyeImg;
var rightEyeImg;
var noseImg;
var mouthImg;

var leftEyePath;
var rightEyePath;
var nosePath;
var mouthPath;

function setImagePaths() {
  leftEyePath = '/images/left_eye/' + int(random(1,5)) + '.png';
  rightEyePath = '/images/right_eye/' + int(random(1,5)) + '.png';
  nosePath = '/images/nose/' + int(random(1,6)) + '.png';
  mouthPath = '/images/mouth/' + int(random(1,7)) + '.png';
}

function preload() {
  setImagePaths();
  leftEyeImg = loadImage(leftEyePath);
  rightEyeImg = loadImage(rightEyePath);
  noseImg = loadImage(nosePath);
  mouthImg = loadImage(mouthPath);
}

function setup() {

  // motion detection
  video = createCapture(VIDEO);
  video.size(640 / scalar, 480 / scalar);
  video.hide();
  pFrame = createImage(video.width, video.height);

  // face tracking
  capture = createCapture({
    audio: false,
    video: {
      width: w,
      height: h
    }
  }, function() {
    console.log('capture ready.')
  });

  capture.elt.setAttribute('playsinline', '');

  canvas = createCanvas(w, h);
  canvas.parent("canvas");

  capture.size(w, h);
  capture.hide();

  tracker = new clm.tracker();
  tracker.init();
  tracker.start(capture.elt);
}

function draw() {
  run(); // run main app
}
