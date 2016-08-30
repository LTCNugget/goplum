<?php header("Access-Control-Allow-Origin: *"); ?>
<?php
	ini_set("max_execution_time", 180);
	$debug = true;
	$dir = "C:/Suitcase/Documents/mini-server/files/music/";
	$artloctxt = $dir . "art-urls.txt";
	require "cleanandfilter-musicnames.inc.php";
	function debugAlert($alert) {
		global $debug;
		if ($debug) {
			echo $alert . "<br>";
		}
	}
	function isNull($err) {
		echo "ERROR: " . $err . " is null<br>";
	}
	function invalidURL($subject) {
		echo $subject . " is from an invalid url<br>";
	}
	$songData = json_decode(file_get_contents('php://input'));
	if ($songData->info->artist !== null || $songData->info->artist !== "") {
		$artist = $songData->info->artist;
		$artist = cleanandfilter($artist);
		$dir = $dir . $artist . "/";
		if (file_exists($dir) == false) {
			mkdir($dir, 0777, true);
			debugAlert($artist . " is the artist and directory was made");
		} else {
			debugAlert($artist . " already exists");
		}
		if ($songData->info->album !== null) {
			$album = $songData->info->album;
			$album = cleanandfilter($album,$artist,true);
			$dir = $dir . $album . "/";
			if (file_exists($dir) == false) {
				mkdir($dir, 0777, true);
				debugAlert($album . " is the album and directory was made");	
				if ($songData->info->art !== null || $songData->info->art !== "") {
					$savart = $dir . $album . ".jpg";
					$arturl = $songData->info->art;
					if (!file_exists($savart) || (fopen($arturl, 'r') !== fopen($savart, 'r'))) {
						if (preg_match("/^https:\/\/lh\d{1,2}.(?:ggpht|googleusercontent).com\/(?:\w|-)+=s\d{2,5}-c-e\d{1,5}/",$arturl) == 1) {
							file_put_contents($savart, fopen($arturl, 'r'));
							file_put_contents($artloctxt, file_get_contents($artloctxt)."\"".$artist."\",\"".$album."\",\"".$arturl."\"".PHP_EOL);
							debugAlert("<img src=\"files/music/$artist/$album/$album" . ".jpg\" width=\"100\" height\"100\">");
						} else {
							invalidURL("art");
						}
					} else {
						debugAlert("art already exists");
					}
				} else {
					isNull("albumart");
				}
			} else {
				debugAlert($album . " already exists");
			}
			if ($songData->info->title !== null && $songData->urls !== null) {
				$songfile = "";
				foreach($songData->urls as $url) {
					if (preg_match("/^https:\/\/r\d{1,2}---sn-\w{8}.c.doc-0-0-sj.sj.googleusercontent.com\/videoplayback\?id=\w+&/", $url)) {
						$songfile = $songfile . file_get_contents($url);
					} else {
						$songfile = "INVALID_URL";
						invalidURL("song");
						break;
					} 
					if ($http_response_header[0] == "HTTP/1.1 403 Forbidden") {
						$songfile = "403_FORBIDDEN";
						debugAlert("one of the songs url's is forbidden");
						break;
					}
				}
				if ($songfile !== ("403_FORBIDDEN" || "INVALID_URL")) {
					$title = $songData->info->title;
					$title = cleanandfilter($title,$artist);
					$savfile = $dir . $title . ".m4a";
					file_put_contents($savfile, $songfile);
					if (file_exists($savfile)) {
						debugAlert("file " . $songData->info->title . " was made");
					} else {
						debugAlert("file was not made");
					}
				}
			} else {
				isNull("title and/or urls");
			}
		} else {
			isNull("album");
		}
	} else {
		isNull("artist");
	}
?>