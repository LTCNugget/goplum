// background.js

var settings;
var songData = { "info": {  } };
var debug = true;
var forcestop = false;
chrome.storage.sync.get("settings", function(getData){console.log(getData); settings=getData.settings});

function httpGet( url ) {
	if (forcestop) return false;
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", url, false );
	xmlHttp.send( null );
	if (debug) console.log("A GET request was sent");
	return xmlHttp.responseText;
}
function httpPost( url, data ) {
	if (forcestop) return false;
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "POST", url, true );
	xmlHttp.send( data );
	if (debug) console.log("A POST request was sent");
	return xmlHttp.responseText;
}

chrome.runtime.onMessage.addListener(function(message) {
chrome.storage.sync.get("settings", function(getData){console.log(getData); settings=getData.settings});
	if (message.greeting == "goplum-info") {
		if (debug) console.log("A message with the greeting of 'goplum-info' was recieved");
		parsed = JSON.parse(message.text);
		songData.info.title = parsed.title;
	 	songData.info.album = parsed.album;
	  	songData.info.artist = parsed.artist;
	   	songData.info.art = parsed.art;
	   	songData.status = "song";
	} else if (message.greeting == "goplum-ad") {
  	if (debug) console.log("A message with the greeting of 'goplum-ad' was recieved");
  	songData.status = "advertisement";
  }
});
chrome.webRequest.onCompleted.addListener(function(request) {
	if (debug) console.log("A request matching the filter was completed");
	if (!forcestop) {
		chrome.tabs.executeScript({
			code: 'if (document.getElementsByClassName("player-album")[0]!==undefined) {var songInfo={title:document.getElementById("currently-playing-title").innerText,album: document.getElementsByClassName("player-album")[0].innerText,artist:document.getElementsByClassName("player-artist")[0].innerText,art:document.getElementById("playerBarArt").src};chrome.runtime.sendMessage({greeting:"goplum-info",text:JSON.stringify(songInfo)});} else {console.log("advertisement");chrome.runtime.sendMessage({greeting:"goplum-ad"});}'
		});
	}
	songData.urls = JSON.parse(httpGet(request.url + "&goplum=true").replace("\u003d", "=").replace("\u0026", "&")).urls;
	setTimeout(function() {
		if (debug) console.log("The timeout for httpPost() has ended");
		if (songData.status !== "advertisement") {
			if (debug) console.log(songData);
			console.log(settings.postsite);
			if (!forcestop) {httpPost(settings.postsite, JSON.stringify(songData));}
			
			if (request.url.substr(30, 5) == "mplay" && !forcestop) setTimeout(function() { chrome.tabs.executeScript({ code:'document.getElementById("player-bar-forward").click()' }) }, 5000);
		} else {
			if (debug) console.log("advertisement");
		}
  }, 1000);
}, {urls:["https://play.google.com/music/mplay?*&start=0","https://play.google.com/music/wplay?*&start=0"]});
