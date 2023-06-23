'use strict'
// index.js
// This is our main server file

// A static server using Node and Express
const express = require("express");

const fetch = require("cross-fetch");
const db = require("./sqlWrap");
const dbo = require("./databaseOps");
const win = require("./pickWinner");


// gets data out of HTTP request body 
// and attaches it to the request object
const bodyParser = require('body-parser');
// create object to interface with express
const app = express();

app.use(bodyParser.json());
// make all the files in 'public' available 
app.use(express.static("public"));

// Code in this section sets up an express pipeline
// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method, req.url);
  next();
})

// if no file specified, return the main page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/tiktokpets.html");
});

app.post("/videoData",
  async function(req, res) {
    let url = req.body.URL;
    let nickname = req.body.nickname;
    let username = req.body.username;

    console.log("add video", url, nickname, username);

    // check the number of videos in the database
    let numVideos = await dbo.get_num_videos();
    if ((numVideos != null) && (numVideos >= 8)) {
      res.send("database is full");
    }
    else {
      // otherwise, find most recent item and toggle
      await dbo.update_video();
      // insert new item into db
      await dbo.post_video(url, nickname, username);
      // for debugging
      let dbState = await dbo.get_all()
      console.log(dbState);
      // send back HTTP response with status 200 to indicate success
      res.status(200).send();
    }
  });

app.get("/getMostRecent", async function(req, res) {
  console.log("getting the most recent video data");
  let result = await dbo.get_most_recent();
  res.send(result);
});

app.get("/getAll", async function(req, res) {
  console.log("getting all video data");
  let result = await dbo.get_all();
  res.send(result);
})

//STEP 2 
app.get("/getTwoVideos", async function(req, res) {
  console.log("getting two random videos");
  // will fail if not enough videos
  try {
    let videoList = await dbo.get_all();
    let result = pickTwoVideos(videoList);
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
})

// STEP 
app.get("/getWinner", async function(req, res) {
  console.log("getting winner");
  // will fail if not enough videos
  let videoList = await dbo.get_all();
  console.log(videoList.length);
  let winner = await win.computeWinner(videoList.length, false);
  res.json(videoList[winner]);
})

//STEP 5
app.post("/insertPref", async function(req, res) {
  let data = req.body;
  let sql = `INSERT INTO PrefTable (better, worse) VALUES (${data.better}, ${data.worse})`

  await db.run(sql);
  // STEP 7
  // Getting prefTable, to check length of...
  let prefTable = await db.all("SELECT * FROM PrefTable");
  let responseJson = { text: "continue" };
  if (prefTable.length >= 15) {
    responseJson = { text: "pick winner" }
  }
  // Sending back json, because of how headers are set... Or some reason?
  res.send(responseJson)
});

app.post("/deleteVideo",
  async function(req, res) {
    console.log("delete video", req.body);
    // check validation
    console.log(req.body);
    //if (validationResult(req).errors.length != 0) {
    // res.status(500).end();
    //  return;
    //}

    let nickname = req.body.nickname;

    console.log("delete video", nickname);

    await dbo.delete_video(nickname);
    res.status(200).end();
  }
);

// Need to add response if page not found!
app.use(function(req, res) {
  res.status(404);
  res.type('txt');
  res.send('404 - File ' + req.url + ' not found');
});

// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function() {
  console.log("The static server is listening on port " + listener.address().port);
});


function pickTwoVideos(videoList) {
  let n = videoList.length;
  if (n < 2) {
    throw "Error: not enough videos";
    // function returns here
  }

  // variables are undefined if not initialized, but we show it for clarity
  let v1 = undefined;
  let v2 = undefined;
  while (v1 == v2) {
    v1 = getRandomInt(n);
    v2 = getRandomInt(n);
  }
  let result = [videoList[v1], videoList[v2]];
  return result;
}

function getRandomInt(max) {
  let n = Math.floor(Math.random() * max);
  // console.log(n);
  return n;
}