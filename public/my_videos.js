/* 
First, code that is run every time this page comes up.  */

// Grab the HTML elements we will use
// uploadWrapper will contain the boxes and x's
const uploadWrapper = document.getElementById("uploadWrapper");

// The buttons
const addNew = document.getElementById("addNew");
addNew.addEventListener("click",addNewRedirect);
const playGame = document.getElementById("playGame");
playGame.addEventListener("click",playGameRedirect);

// global variable that will hold current list of video names
// Needed so that we can delete videos by index
let videoNames = [];

// Get the list of videos from the server and displays the information 
// on the Web page
// The flag "false" indicates that this is the first time we are getting the videos.
loadVideos(false);

/* The main function run every time we have to refresh the page */

// loadVideos has to be async because it sends a GET request to the server
// if "reload" is false, this is the first time the data is being 
// loaded, so we need to draw the 
// boxes.
async function loadVideos(reload) {
  // send the GET request
  let videoRes = await fetch("./getAll");
  // convert the returned JSON, which goes into videoData
  let videoData = await videoRes.json();

  // videoData is now an array of objects
  // The "map" method of an array A creates a new array B
  // by applying a function to every element of A.
  // So, here we turn the array of objects into
  // an array of nicknames.

  // videoNames is a global variable
  videoNames = videoData.map(item => item.nickname);

  // if we are just refreshing the video names and xes, call reloadFields.
  if (reload) {
    writeNames(videoNames);
  } else {
    // first create DOM elements
    createElements();
    writeNames(videoNames);
  }
  // either way, set up two buttons
  enableButtons(videoNames);
}


// sets up the two pink buttons
// already 8 videos? "Add New" should be greyed out & disabled
// play game should be pink
// < 8 videos? play game should be greyed out
// add new should be enabled & pink
function enableButtons(videoNames) {

  // count how many video names are filled in from HTML
  let numVideos = videoNames.length;
  
  if (numVideos < 8) {
    addNew.setAttribute("class", "enabledButton");
    playGame.setAttribute("class", "disabledButton");
    
  } else {
    addNew.setAttribute("class", "disabledButton");
    playGame.setAttribute("class", "enabledButton");
  }
}




// Add elements to the DOM for all the boxes and 
// add an x for every line.  

function createElements() {
  console.log("populating DOM");
  // make two groups of four buttons so that we can get the Desktop view. 
  for (let k = 0; k<2; k++) {
const halfList = document.createElement("div");
halfList.classList.add("class", "halfList");
    
  for (let i = k*4; i < k*4+4; i++) {
    const videoField = document.createElement("div");
    const videoName = document.createElement("div");
    const x = document.createElement("div");
  
    videoName.setAttribute("class", "videoName");
    videoField.setAttribute("class","videoField");


    x.textContent = "X"
    x.setAttribute("class", "removeVideo");
    // the closure of this anonymous click function will store the value of i
    x.addEventListener("click", function() {
      deleteVideo(i);
      });
                     
    videoField.appendChild(videoName);
    videoField.appendChild(x);
    halfList.appendChild(videoField);
  }
 uploadWrapper.appendChild(halfList);
 }
}


// Function to make the list displayed on the page match the videoNames we got from the server
function writeNames(videoNames) {
  
  const videoNameElmts = document.getElementsByClassName("videoName");

  
  for (let i = 0; i < videoNames.length; i++) {
    let name = videoNameElmts[i];
    name.textContent = videoNames[i];
        name.classList.add("populatedVideoName");
  }
  
  for (let i = videoNames.length; i < 8; i++) {
    let name = videoNameElmts[i];
    name.textContent = "";
    name.classList.add("unpopulatedVideoName");
  }
}


// send a post request to the server to tell them to delete a video.
// when the result comes back, re-do the display 
async function deleteVideo(i) {

  console.log("asking to delete",videoNames[i]);

if (videoNames[i] != "") {
  
  // put the nickname into an object
  let data = {
    "nickname": videoNames[i],
  };
  
  await sendPostRequest("/deleteVideo", data);

  // the "true" argument specifies that this is a reload.
  loadVideos(true);
  }
}

// button action function for "Add New"
function addNewRedirect() {
  // this refers to the button DOM element
  if (this.classList.contains("enabledButton")) {
  window.location = './tiktokpets.html';
  }
}

function playGameRedirect() {
  // this refers to the button DOM element
 if (this.classList.contains("enabledButton")) {
  window.location = './compare.html';
  }
} 


