// background.js

var settings,
		songData = { "info": {  } },
		debug = true,
		forcestop = false;
chrome.storage.sync.get("settings", function(getData) {
	console.log(getData);
	settings = getData.settings;
});

function httpGet(url) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", url, false);
	xmlHttp.send(null);
	if (debug) console.log("A GET request was sent");
	return xmlHttp.responseText;
}
function httpPost(url, data) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", url, true);
	xmlHttp.send(data);
	if (debug) console.log("A POST request was sent");
	return xmlHttp.responseText;
}
function clearVarsOnStop() {
	songData = { "info": {  } };
	if (debug) console.log("Variables cleared");
}
function findMusic(onEachFunc) {
	chrome.tabs.query({
		url:"https://play.google.com/music/listen?*"
	}, function(gmTabs) {
		gmTabs.forEach(function(currtab) {
			onEachFunc(currtab);
		});
	});
}
function playerControl(action) {
	if (!forcestop) {
		switch (action) {
			case "fast-forward":
				findMusic(function(musictab) {
					chrome.tabs.executeScript(musictab.id, {
						code: 'document.getElementById("player-bar-forward").click()'
					});
				});
			break;
			case "pause":
				findMusic(function(musictab) {
					chrome.tabs.executeScript(musictab.id, {
						code: 'document.getElementById("player-bar-play-pause").click()'
					});
				});
			break;
		}
	} else {
		clearVarsOnStop();
		return false;
	}
}

chrome.runtime.onMessage.addListener(function(message) {
	chrome.storage.sync.get("settings", function(getData) {
		console.log(getData);
		settings = getData.settings;
	});
	if (!forcestop) {
		switch (message.greeting) {
			case "goplum-info":
				if (debug) console.log("Message 'goplum-info' recieved");
				parsed = JSON.parse(message.text);
				songData.info.title = parsed.title;
			 	songData.info.album = parsed.album;
				songData.info.artist = parsed.artist;
				songData.info.art = parsed.art;
				songData.status = "song";
			break;
			case "goplum-stop":
				forcestop = true;
				if (debug) console.log("Message 'goplum-stop' recieved");
				clearVarsOnStop();
			break;
			case "goplum-restart":
				if (debug) console.log("Message 'goplum-restart' recieved");
				forcestop = false;
			break;
			case "goplum-ad":
				if (debug) console.log("Message 'goplum-ad' recieved");
				songData.status = "advertisement";
			break;
		}
	} else {
		clearVarsOnStop();
		return false;
	}
});
chrome.webRequest.onCompleted.addListener(function(request) {
	if (debug) console.log("A request matching the filter was completed");
	findMusic(function(musictab) {
		if (!forcestop) {
			chrome.tabs.executeScript(musictab.id, {
				file: "js/inject.js"
			});
		} else {
			clearVarsOnStop();
			return false;
		}
	});
	songData.urls = JSON.parse(httpGet(request.url + "&goplum=true").replace("\u003d", "=").replace("\u0026", "&")).urls;
	setTimeout(function() {
		if (debug) console.log("The timeout for httpPost() has ended");
		if (songData.status !== "advertisement") {
			if (debug) console.log(songData);
			console.log(settings.postsite);
			if (!forcestop) {
				httpPost(settings.postsite, JSON.stringify(songData));
			} else {
				clearVarsOnStop();
				return false;
			}
			if (request.url.substr(30, 5) == "mplay") {
				if (!forcestop) {
					setTimeout(playerControl("fast-forward"), 5000);
				} else {
					clearVarsOnStop();
					return false;
				}
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
