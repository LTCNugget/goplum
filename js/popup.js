var settings, getBytesInUse, remote;
function savesettings() {
	chrome.storage.sync.set({
		"settings": {
			"postsite": document.getElementById("postsite").value
		}
	});
}
chrome.storage.sync.getBytesInUse(null, function(bytes) { getBytesInUse = bytes; });
window.onload = function() {
	document.getElementById("savebox").addEventListener("click", savesettings);
	if(getBytesInUse === 0) {
		chrome.storage.sync.set({
			"settings": {
				"postsite": "https://24.125.232.31/scripts/goplum.php"
			}
		});
		document.getElementById("postsite").value = "https://24.125.232.31/scripts/goplum.php"
	} else {
		chrome.storage.sync.get("settings", function(getData) {
			console.log(getData);
			document.getElementById("postsite").value = getData.settings.postsite;
		});
	}
}