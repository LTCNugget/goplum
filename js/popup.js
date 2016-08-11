var settings, bytesInUse, remote;
function savesettings() {
	var isUrlMatch = document.getElementById("postsite").value.match("http(?:s?):\/\/(?:(?:[a-z]+\.)?[a-z]+\.[a-z]+|[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})(?:(?:\/(?:[a-z]|[0-9])+)?)+?\/(?:[a-z]|[0-9])+(\.php)");
	if (isUrlMatch) {
		chrome.storage.sync.set({
			"settings": {
				"postsite": document.getElementById("postsite").value
			}
		});
	} else {
		console.log("url does not fit requirements");
	}
}
function forcestop() {
	if (!chrome.extension.getBackgroundPage().forcestop) {
		chrome.extension.getBackgroundPage().forcestop = true;
		console.log("Stopping...");
	}
}
function restart() {
	if (chrome.extension.getBackgroundPage().forcestop) {
		chrome.extension.getBackgroundPage().forcestop = false;
		console.log("Restarting...");
	}
}
chrome.storage.sync.getBytesInUse(null, function(bytes) { bytesInUse = bytes; });
window.onload = function() {
	document.getElementById("savebox").addEventListener("click", savesettings);
	document.getElementById("stopall").addEventListener("click", forcestop);
	document.getElementById("restart").addEventListener("click", restart);
	chrome.storage.sync.get("settings", function(getData) {
		console.log(getData);
		document.getElementById("postsite").value = getData.settings.postsite;
	});
}
