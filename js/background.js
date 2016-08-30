// js/background.js

var settings,
		songData = {
			"info": {  }
		},
		forcestop = false;

chrome.storage.sync.get("settings", function(getData) {
	console.log(getData);
	settings = getData.settings;
});

function playerControl(action) {
	switch (action) {
		case "next-song":
			findMusic(function(musictab) {
				chrome.tabs.executeScript(musictab.id, {
					code: "document.getElementById('player-bar-forward').click()"
				});
			});
		break;
		case "last-song":
			findMusic(function(musictab) {
				chrome.tabs.executeScript(musictab.id, {
					code: "document.getElementById('player-bar-play-rewind').click();"
				});
			});
		break;
		case "pause":
			findMusic(function(musictab) {
				chrome.tabs.executeScript(musictab.id, {
					code: "if (document.getElementById('player-bar-play-pause').title=='Pause'){document.getElementById('player-bar-play-pause').click();}"
				});
			});
		break;
		case "play":
			findMusic(function(musictab) {
				chrome.tabs.executeScript(musictab.id, {
					code: "if (document.getElementById('player-bar-play-pause').title=='Play'){document.getElementById('player-bar-play-pause').click();}"
				});
			});
		break;
	} // switch (action)
} // function playerControl()

function httpGet(url) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", url, false);
	xmlHttp.send(null);
	return xmlHttp.responseText;
}

function httpPost(url, data) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", url, true);
	xmlHttp.send(data);
	return xmlHttp.responseText;
}

function forceStopping() {
	forcestop = true;
	playerControl("Pause");
}

function findMusic(onEachFunc) {
	chrome.tabs.query({
		url: "https://play.google.com/music/listen?*"
	}, function(gmTabs) {
		gmTabs.forEach(function(currtab) {
			onEachFunc(currtab);
		});
	});
}

chrome.runtime.onMessage.addListener(function(message) {
	switch (message.greeting) {
		case "goplum-stop":
			forceStopping();
		break;
		case "goplum-restart":
			forcestop = false;
		break;
	} // switch (message.greeting)
}); // onMessage.addListener()

chrome.webRequest.onCompleted.addListener(function(request) {
	if (!forcestop) {
		chrome.runtime.onMessage.addListener(function goplumInfoResponse(message) {
			chrome.runtime.onMessage.removeListener(goplumInfoResponse);
			chrome.storage.sync.get("settings", function(getData) {
				console.log(getData);
				settings = getData.settings;
			});
			if (message.greeting === "goplum-info") {
				parsed = JSON.parse(message.text);
				songData.info.title = parsed.title;
			 	songData.info.album = parsed.album;
				songData.info.artist = parsed.artist;
				songData.info.art = parsed.art.replace("s90-c-e", "s500-c-e");
			}
		}); // onMessage.addListener()
		findMusic(function(musictab) {
			chrome.tabs.executeScript(musictab.id, {
				file: "js/inject.js"
			});
		}); // findMusic()
		JSONStringMplay = httpGet(request.url + "&goplum=true").replace("\u003d", "=").replace("\u0026", "&");
		songData.urls = JSON.parse(JSONStringMplay).urls;
		setTimeout(function() {
			console.log(settings.postsite);
			httpPost(settings.postsite, JSON.stringify(songData));
			if (!forcestop) {
				setTimeout(function() {
					playerControl("next-song");
				}, 9000);
			}
		}, 1000);
	} else {
		forceStopping();
	}
}, {
	urls: [
		"https://play.google.com/music/mplay?*&start=0"
	]
});
