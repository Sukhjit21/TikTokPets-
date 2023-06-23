// when this page is opened, get the most recently added video and show it.
// function is defined in video.js
let divElmt = document.getElementById("tiktokDiv");

let reloadButton = document.getElementById("reload");
// set up button to reload video in "tiktokDiv"
reloadButton.addEventListener("click", function() {
  reloadVideo(tiktokDiv);
});

getMostRecent();

async function getMostRecent() {
  let recentVideoRes = await fetch("/getMostRecent");
  let recentVideoData = await recentVideoRes.json();
  console.log(recentVideoData);
  const recentURL = recentVideoData.url;
  console.log("most recently added video url", recentURL);
  addVideo(recentURL, divElmt);
  loadTheVideos();
}


