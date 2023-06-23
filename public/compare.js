// a global variable indicating which video is loved
let loved = null;

let videoElmts = document.getElementsByClassName("tiktokDiv");

let reloadButtons = document.getElementsByClassName("reload");

let unlovedHeartButtons = document.getElementsByClassName("heart unloved");

let lovedHeartButtons = document.getElementsByClassName("heart loved");

let nextButton = document.getElementsByClassName("enabledButton");
nextButton[0].addEventListener("click", sendPrefs);

let videoPair;

for (let i = 0; i < 2; i++) {
  let reload = reloadButtons[i];
  reload.addEventListener("click", function() { reloadVideo(videoElmts[i]) });

  let unlovedHeart = unlovedHeartButtons[i];
  let lovedHeart = lovedHeartButtons[i];
  //STEP 4
  // variables all in closure!
  unlovedHeart.addEventListener("click", function() {
    console.log("toggle unloved");
    loved = i;
    correctHeartButtons();
  });

  lovedHeart.style.display = "none";
  // lovedHeart.addEventListener("click", function() {
  //   console.log("toggle loved");
  //   // the other one is loved. 
  //   // using the ternary operator.
  //   loved = (i==0) ? 1 : 0;
  //   correctHeartButtons();
  // })
}

addNewVideoPair();

// displays heart buttons correctly depending on which is loved
function correctHeartButtons() {
  for (let i = 0; i < 2; i++) {
    let lovedHeart = lovedHeartButtons[i];
    let unlovedHeart = unlovedHeartButtons[i];
    if (i == loved) {
      lovedHeart.style.display = "inline";
      unlovedHeart.style.display = "none";
    } else {
      lovedHeart.style.display = "none";
      unlovedHeart.style.display = "inline";
    }
  }
}

// STEP 3
async function addNewVideoPair() {
  try {
    console.log("sending request for pair");
    videoPair = await sendGetRequest("/getTwoVideos");
    console.log(videoPair);
    for (let i = 0; i < 2; i++) {
      let url = videoPair[i].url;
      console.log(url);
      addVideo(url, videoElmts[i]);
    }
    // load the videos after the names are pasted in! 
    loadTheVideos();
  } catch (err) {
    alert("loading error:", err);
  }
}

// STEP 6
async function sendPrefs() {
  // Get prefs 
  let unloved = (loved == 0) ? 1 : 0;
  let better = videoPair[loved].rowIdNum;
  let worse = videoPair[unloved].rowIdNum;

  let data = {
    "better": better,
    "worse": worse
  }
  console.log(data);
  // Need to send actual prefs.
  let result = await sendPostRequest("/insertPref", data);
  // STEP 8
  if (result.text === "continue") {
    location.reload();
  } else if (result.text === "pick winner") {
    window.location.href = "winner.html";
  }

}

