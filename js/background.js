// background.js

var songData = {  };
var debug = true;

function httpGet( url ) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", url, false );
  xmlHttp.send( null );
  if (debug) console.log("A GET request was sent");
  return xmlHttp.responseText;
}
function httpPost( url, data ) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "POST", url, true );
    xmlHttp.send( data );
    if (debug) console.log("A POST request was sent");
    return xmlHttp.responseText;
}

chrome.runtime.onMessage.addListener(function(message) {
  if (message.greeting == "infojson") {
    if (debug) console.log("A message with the greeting of 'infojson' was recieved");
    parsed = JSON.parse(message.text);
    songData.title = parsed.title;
    songData.album = parsed.album;
    songData.artist = parsed.artist;
    songData.art = parsed.url;
  }
}
chrome.webRequest.onCompleted.addListener(function(request) {
  if (debug) console.log("A request matching the filter was completed");
  chrome.tabs.executeScript({
    code: 'var songInfo = { }; songInfo.title = $("#currently-playing-title").innerText; songInfo.album = $(".player-album").innerText; songInfo.artist = $(".player-artist").innerText; songInfo.art = $("#playerBarArt").src; chrome.runtime.sendMessage({greeting:"infojson", text:JSON.stringify(songInfo)});'
  });
  songdata.urls = JSON.parse(httpGet(request.url).replace("\u003d", "=").replace("\u0026", "&")).urls;
  httpPost("//24.125.232.31/scripts/goplum.php", JSON.stringify(songData));
}, {urls:["*://play.google.com/music/mplay","*://play.google.com/music/wplay"]});


//
// old
//
/*
function sendToContent(mail) { 
  chrome.tabs.query({url:"*://play.google.com/listen*"}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, mail);
  });
}
function fixurlcode(string) {
  string = string.replace("\u003d", "=").replace("\u0026", "&");
  return string;
}
function postData(dataObj) {
  songDataString = fixurlcode(JSON.stringify(dataObj));
  $.ajax({ data:dataObj, method:"POST", url:"http://24.125.232.31/scripts/goplum.php" });
}
var songData = { };
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  switch (message.greeting) {
    case "urls": sendToContent({greeting:"getInfo"});
    songdata.urls = message.mplayurls; break;
    case "info": songData.info = message.info; console.log(songData); // postData(songData);
    sendToContent({greeting:"nextsong"}); $songData = { }; break;
  }
}
*/