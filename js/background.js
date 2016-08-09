// background.js

var settings;
var songData = { "info": {  } };
var debug = true;
var forcestop = false;
chrome.storage.sync.get("settings", function(getData) {
	console.log(getData);
	settings = getData.settings
});

function httpGet(url) {
	if (forcestop) {
		clearVarsOnStop();
		return false;
	}
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", url, false);
	xmlHttp.send(null);
	if (debug) console.log("A GET request was sent");
	return xmlHttp.responseText;
}
function httpPost(url, data) {
	if (forcestop) {
		clearVarsOnStop();
		return false;
	}
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", url, true);
	xmlHttp.send(data);
	if (debug) console.log("A POST request was sent");
	return xmlHttp.responseText;
}
function clearVarsOnStop() {
	songData = null;
}

chrome.runtime.onMessage.addListener( function(message) {
	chrome.storage.sync.get("settings", function(getData) {
		console.log(getData);
		settings = getData.settings;
	});
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
chrome.webRequest.onCompleted.addListener( function(request) {
	if (debug) console.log("A request matching the filter was completed");
	chrome.tabs.query({
		url:"https://play.google.com/music/listen?*"
	}, function(gmTabs) {
		gmTabs.forEach( function(currtab) {
			if (!forcestop) {
				chrome.tabs.executeScript({
					file: inject.js
				});
			} else {
				clearVarsOnStop();
			}
		});
	});
	songData.urls = JSON.parse(httpGet(request.url + "&goplum=true").replace("\u003d", "=").replace("\u0026", "&")).urls;
	setTimeout( function() {
		if (debug) console.log("The timeout for httpPost() has ended");
		if (songData.status !== "advertisement") {
			if (debug) console.log(songData);
			console.log(settings.postsite);
			if (!forcestop) {
				httpPost(settings.postsite, JSON.stringify(songData));
			} else {
				clearVarsOnStop();
			}
			if (request.url.substr(30, 5) == "mplay" && !forcestop) {
				setTimeout( function() {
					chrome.tabs.query({
						url: "https://play.google.com/music/listen?*"
					}, function(gmTabs) {
						gmTabs.forEach( function(currtab) {
							if (!forcestop) {
								chrome.tabs.executeScript({
									code: 'document.getElementById("player-bar-forward").click()'
								});
							} else {
								clearVarsOnStop();
							}
						});
					});
				}, 5000);
			} else {
				clearVarsOnStop();
			}
		} else {
			if (debug) console.log("advertisement");
		}
	}, 1000);
}, {
	urls: [
		"https://play.google.com/music/mplay?*&start=0",
		"https://play.google.com/music/wplay?*&start=0"
	]
});
