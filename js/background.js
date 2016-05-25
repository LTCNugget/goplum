// background.js

var songData = { "info": {  } };
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
    songData.info.title = parsed.title;
    songData.info.album = parsed.album;
    songData.info.artist = parsed.artist;
    songData.info.art = parsed.art;
  }
});
chrome.webRequest.onCompleted.addListener(function(request) {
  if (debug) console.log("A request matching the filter was completed");
  setTimeout(function() {
    if (debug) console.log("The timeout() for .executeScript has ended");
    chrome.tabs.executeScript({
      code: 'var songInfo = { title:$("#currently-playing-title").innerText, album:$(".player-album").innerText, artist:$(".player-artist").innerText, $("#playerBarArt").src }; console.log(songInfo); chrome.runtime.sendMessage({greeting:"infojson", text:JSON.stringify(songInfo)});'
    });
  }, 2000);
  songData.urls = JSON.parse(httpGet(request.url + "&goplum=true").replace("\u003d", "=").replace("\u0026", "&")).urls;
  setTimeout(function() {
    if (debug) console.log("The timeout() for httpPost() has ended");
    if (songData.info.artist) httpPost("//24.125.232.31/scripts/goplum.php", JSON.stringify(songData));
  }, 2000);
}, {urls:["https://play.google.com/music/mplay?*&start=0","https://play.google.com/music/wplay?*&start=0"]});