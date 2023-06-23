// when this page is opened, get the most recently added video and show it.
// function is defined in video.js
let divElmt = document.getElementById("tiktokDiv");

let reloadButton = document.getElementById("reload");
// set up button to reload video in "tiktokDiv"
reloadButton.addEventListener("click",function () {
  reloadVideo(tiktokDiv);
});

/* things to do immediately when page is loaded */

showWinningVideo()
/*
.catch(function(err){
  alert("error showing winner");
});
*/

async function showWinningVideo() {
  // STEP 9
  let video = await sendGetRequest("/getWinner");
  console.log("response", video);
  // STEP 11
  let winningUrl = video.url;
  addVideo(winningUrl, divElmt);
  loadTheVideos();
}