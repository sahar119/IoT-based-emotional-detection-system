// --------------------------------------------------------- //
// Classifier Variable
let classifier;
// Model URL
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/eF56XmyGg/';
// Video
let video;
let flippedVideo;
// To store the classification
let label = "";
let oldlabel = "";


// Load the model first
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

// --------------------------------------------------------- //


// variable for p5.SerialPort object
let serial;
// variable por serialPortName
let serialPortName = 'COM4';
// variable for HTML DOM input for serial port name
let htmlInputPortName;
// variable for HTML DOM button for entering new serial port name
let htmlButtonPortName;
// this is the message that will be sent to the Arduino:
let outMessage = '0';

// --------------------------------------------------------- //


function setup() {
  // small canvas
  createCanvas(300, 300);
  
  // Create the video
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();

  flippedVideo = ml5.flipImage(video)
  // Start classifying
  classifyVideo();
  
  // --------------------------------------------------------- //

  
  // p5.js to create HTML input and set initial value
  htmlInputPortName = createInput(serialPortName);

  // p5.js to create HTML button and set message
  button = createButton('update port');

  // p5.js to add callback function for mouse press
  button.mousePressed(updatePort);

  // create instance of p5.SerialPort
  serial = new p5.SerialPort();

  // print version of p5.serialport library
  console.log('p5.serialport.js ' + serial.version);

  // Get a list the ports available
  // You should have a callback defined to see the results. See gotList, below:
  serial.list();

  // Assuming our Arduino is connected,  open the connection to it
  serial.openPort(serialPortName);

  // When you get a list of serial ports that are available
  serial.on('list', gotList);

  // When you some data from the serial port
  serial.on('data', gotData);
}


function draw() {
 background(0);

 // Draw the video
  image(flippedVideo, 0, 0);

  // Draw the label
  fill(255);
  textSize(16);
  textAlign(CENTER);
  text(label, width / 2, height - 4);

  // place example name on the top of
}

// Get a prediction for the current video frame
function classifyVideo() {
  flippedVideo = ml5.flipImage(video)
  classifier.classify(flippedVideo, gotResult);
}

// When we get a result
function gotResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  // console.log(results[0]);
  label = results[0].label;
  
  if(label!=oldlabel){
    serial.write(label);
    oldlabel = label;
  }
  
  
  // Classifiy again!
  classifyVideo();
}





// callback function to update serial port name
function updatePort() {
  // retrieve serial port name from the text area
  serialPortName = htmlInputPortName.value();
  // open the serial port
  serial.openPort(serialPortName);
}

// Got the list of ports
function gotList(thelist) {
  console.log('List of Serial Ports:');
  // theList is an array of their names
  for (let i = 0; i < thelist.length; i++) {
    // Display in the console
    console.log(i + ' ' + thelist[i]);
  }
}

// Called when there is data available from the serial port
function gotData() {
  let currentString = serial.readLine();
  console.log(currentString);
}

