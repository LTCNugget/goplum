if (document.getElementsByClassName("player-album")[0] !== undefined) {
	console.log("song");
	var songInfo = {
		title: document.getElementById("currently-playing-title").innerText,
		album: document.getElementsByClassName("player-album")[0].innerText,
		artist: document.getElementsByClassName("player-artist")[0].innerText,
		art: document.getElementById("playerBarArt").src
	};
	console.log(songInfo);
	chrome.runtime.sendMessage({
		greeting: "goplum-info",
		text: JSON.stringify(songInfo)
	});
	console.log("finished sending info");
} else {
	console.log("advertisement");
	chrome.runtime.sendMessage({
		greeting: "goplum-ad"
	});
}
