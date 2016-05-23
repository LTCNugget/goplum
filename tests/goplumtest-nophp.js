function httpGet( url ) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", url, false );
  xmlHttp.send( null );
  return xmlHttp.responseText;
}

function fixurlcode( string ) {
  string = string.replace("\u003d", "=").replace("\u0026", "&");
  return string;
}

function goplumtest( title, album, artist, urls ) {
  var songData = {
    "info": { 
      "title": title,
      "album": album,
      "artist": artist
    }, "urls": urls
  }
  console.log( songData );
  if ( ( typeof( songData.info ) && typeof( songData.urls ) ) == "object" ) {
    songDataString = JSON.stringify( songData );
    console.log( songDataString );
  }
}
function googlemusic( mplayurl ) {
  if ( window.location.hostname == "play.google.com" ) {
    currmplay = JSON.parse( fixurlcode( httpGet( mplayurl ) ) );
    urls = currmplay.urls;
    goplumtest(
      $("#currently-playing-title").innerText,
      $(".player-album").innerText,
      $(".player-artist").innerText,
      urls );
  }
}