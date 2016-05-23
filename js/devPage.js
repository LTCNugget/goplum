// devpage.js

function httpGet(theUrl) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, false);
  xmlHttp.send(null);
  return xmlHttp.responseText;
}
chrome.devtools.network.onRequestFinished.addListener(function(entry) {
  if (entry.request.url.slice(30, 35) == "mplay") {
    currmplay = JSON.parse(httpGet(request.url));
    chrome.runtime.sendMessage({ greeting: "urls", mplayurls: currmplay.urls });
  }
}