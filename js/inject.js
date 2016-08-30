// js/inject.js

if (document.getElementsByClassName("player-album")[0] !== undefined) {
	var songInfo = {
		title: document.getElementById("currently-playing-title").innerText,
		album: document.getElementsByClassName("player-album")[0].innerText,
		artist: document.getElementsByClassName("player-artist")[0].innerText,
		art: document.getElementById("playerBarArt").src
	};
	chrome.runtime.sendMessage({
		greeting: "goplum-info",
		text: JSON.stringify(songInfo)
	});
}
