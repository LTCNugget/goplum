var debug = true;
if (document.getElementsByClassName("player-album")[0] !== undefined) {
	if (debug) console.log("song");
	var songInfo = {
		title: document.getElementById("currently-playing-title").innerText,
		album: document.getElementsByClassName("player-album")[0].innerText,
		artist: document.getElementsByClassName("player-artist")[0].innerText,
		art: document.getElementById("playerBarArt").src
	};
	if (debug) console.log(songInfo);
	chrome.runtime.sendMessage({
		greeting: "goplum-info",
		text: JSON.stringify(songInfo)
	});
	if (debug) console.log("finished sending info");
} else {
	if (debug) console.log("advertisement");
	chrome.runtime.sendMessage({
		greeting: "goplum-ad"
	});
}
