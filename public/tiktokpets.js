let button = document.getElementById("continue");
button.addEventListener("click",buttonPress);

let myVideosButton = document.getElementById("myVideos");
myVideosButton.addEventListener("click", myVideosButtonPress);

function myVideosButtonPress() {
  window.location = "./my_videos.html";
}

// given function that sends a post request
async function sendPostRequest(url,data) {
  params = {
    method: 'POST', 
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data) };
  console.log("about to send post request");
  
  let response = await fetch(url,params);
  if (response.ok) {
    let data = await response.text();
    return data;
  } else {
    throw Error(response.status);
  }
}


function buttonPress() { 
    // Get all the user info.
  let username = document.getElementById("user").value;
  let URL = document.getElementById("URL").value;
  let nickname = document.getElementById("nickname").value;

  let data = {
    "username": username,
    "URL": URL,
    "nickname": nickname,
  };
    
  sendPostRequest("/videoData", data)
  .then( function (response) {
    console.log("Response received", response);
    if (response === "database is full") {
      // do not redirect, show a nice error message
      window.alert(response); // ugly for now :P
    } else {
      window.location = "video_preview.html";
    }
  })
  .catch( function(err) {
    console.log("POST request error",err);
  });
}
