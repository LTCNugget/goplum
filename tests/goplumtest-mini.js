function httpGet(url) {var xmlHttp = new XMLHttpRequest(); xmlHttp.open("GET", url, false); xmlHttp.send(null); return xmlHttp.responseText;} function httpPost(url,data) {var xhttp = new XMLHttpRequest(); xhttp.open("POST", url, true); xhttp.send(data);} function fixurlcode(string) {string = string.replace("\u003d", "=").replace("\u0026", "&"); return string;} function goplumtest(title,album,artist,art,urls) {var songData = {"info":{"title":title,"album":album,"artist":artist, "art":art},"urls":urls}; console.log(songData); if ((typeof(songData.info) && typeof(songData.urls)) == "object" ) {songDataString = JSON.stringify(songData); httpPost("https://24.125.232.31/scripts/goplum.php",songDataString);}} function goplum(mplayurl) {if (window.location.hostname == "play.google.com") {currmplay = JSON.parse(fixurlcode(httpGet(mplayurl))); urls = currmplay.urls; goplumtest($("#currently-playing-title").innerText,$(".player-album").innerText,$(".player-artist").innerText,$("#playerBarArt").src,urls);}}