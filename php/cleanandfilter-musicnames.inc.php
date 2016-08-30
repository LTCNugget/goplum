<?php
	function cleanandfilter($dirty, $xinfo = "", $isalbum = false) {
		$cleaning = str_ireplace(array("\\", '"', "?", "*", "<", ">", "|"), "", $dirty);
		$clean = str_ireplace(array(":", "/"), "-", $cleaning);
		$filtering = str_replace(" The ", " the ", $clean);
		$filtering = str_replace(" Then ", " then ", $filtering);
		$filtering = str_replace(" By ", " by ", $filtering);
		$filtering = str_replace(" Of ", " of ", $filtering);
		$filtering = str_replace(" A ", " a ", $filtering);
		$filtering = str_replace(" For ", " for ", $filtering);
		$filtering = str_replace(" From ", " from ", $filtering);
		$filtering = str_replace(" And ", " and ", $filtering);
		$filtering = str_replace(" In ", " in ", $filtering);
		$filtering = str_replace(" Is ", " is ", $filtering);
		$filtering = str_replace("Feat.", "feat.", $filtering);
		$filtering = str_replace("3Oh!3", "3OH!3", $filtering);
		if ($xinfo == "Trivium" && !$isalbum) { $filtering = str_ireplace("Shogun [with fade, for special edition]", "Shogun", $filtering); }
		if ($xinfo == "Suicide Silence") { $filtering = str_ireplace("Bleed the Fifth", "The Cleansing", $filtering); }
		$filtering = str_replace(array("Devil Driver", "Devildriver"), "DevilDriver", $filtering);
		$filtering = str_ireplace("Attila (00s)", "Attila", $filtering);
		if ($xinfo == "Slash" && !$isalbum) { str_ireplace(array(" (Feat. Myles Kennedy and the Conspirators)", "Featuring Myles Kennedy & the Conspirators"), "", $filtering); }
		if ($xinfo == "Slash" && $isalbum) { str_ireplace("Apocalyptic Love", "Apocalyptic Love (Feat. Myles Kennedy and the Conspirators)", $filtering); }
		if ($xinfo == "Slash" && $isalbum) { str_ireplace("World On Fire", "World On Fire (Feat. Myles Kennedy and the Conspirators)", $filtering); }
		if ($xinfo == "Slash") { str_replace("Made In Stoke (24-7-11)", "Made In Stoke 24-7-11 (Live)", $filtering); }
		if ($xinfo == "Job for a Cowboy") { $filtering = str_replace("Serpents Lamb", "Serpent's Lamb", $filtering); }
		$filtering = str_replace(array("Metalocalypse & Dethklok", "Metalocalypse- Dethklok", "Metalocalypse"), "Dethklok", $filtering);
		$filtered = str_ireplace("(Radio Single)", "(Single)", $filtering);
		return $filtered;
	}
?>