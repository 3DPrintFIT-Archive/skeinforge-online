<?php
function putForm() {
	echo "<p>Upload your STL file (<a href=\"http://fabmetheus.crsndoo.com/wiki/index.php/Skeinforge#File_Formats\" title=\"Supported filetypes\" >or other</a>) and watch the magic.</p>";
	echo "<form method=\"post\" enctype=\"multipart/form-data\">";
	echo "	<p><input type=\"file\" name=\"file\" id=\"file\" /> <select name=\"profile\" id=\"profile\"><option value=\".none\" selected=\"selected\">Choose a profile...</option>";
	if ($handle = opendir('../prefdir/profiles/extrusion')) {
		$profiles = array();
		while ($profiles[] = readdir($handle));
		closedir($handle);
		sort($profiles);
		foreach ($profiles as $profile) {
			if ((substr($profile,0,1) != ".") && ($profile != "")) {
				echo "<option value=\"".$profile."\">".$profile."</option>";
			}
		}
	} else {
		echo "	<p><strong>Error:</strong> Cannot open profiles dir.</p>";
	}
	echo "</select> <input type=\"submit\" name=\"submit\" value=\"Upload\" /></p>";
	echo "</form>";
}

function dwnLink($basename) {
	if (file_exists("files/".$basename.'_export.gcode')) {
		echo "<p><strong>Download:</strong> <a href=\"files/".$basename ."_export.gcode\">".$basename ."_export.gcode</a> &mdash; Your files will be deleted in 24 hours.</p>";
	} else {
		echo "<p><strong>Error:</strong> The process ended without gcode, see the log for more information.</p>";
	}
}
?>
<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<title>Skeinforge online</title>
	<link rel="shortcut icon" href="favicon.png" type="image/x-icon" />
	<link rel="stylesheet" type="text/css" href="style.css" />
	<script>
	function loadLog(job) {
		var xmlhttp;
		if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp=new XMLHttpRequest();
		} else {// code for IE6, IE5
			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.onreadystatechange=function() {
			if (xmlhttp.readyState==4 && xmlhttp.status==200) {
				document.getElementById("terminal").innerHTML=xmlhttp.responseText;
			}
		}
		xmlhttp.open("GET","files/"+job+".log",true);
		xmlhttp.send();
	}
	</script>
</head>
<body>
	<a href="https://github.com/3DprintFIT/skeinforge-online"><img style="position: absolute; top: 0; left: 0; border: 0;" src="https://s3.amazonaws.com/github/ribbons/forkme_left_orange_ff7600.png" alt="Fork me on GitHub"></a>
	<a href="/" class="brand">
		<img class="brand-image" alt="3D Print Lab logo" src="logo.png">
		<div class="brand-text"><strong>Skeinfogre</strong>online</div>
	</a>
	<h1>Convert your 3D model into G-Code</h1>
	<?php
	if ($_FILES["file"]["tmp_name"] != "") {
		$allowedExts = array("stl", "gts", "obj", "bfb");
		$extension = strtolower(end(explode(".", $_FILES["file"]["name"])));
		$profile = $_POST["profile"];
		if ($_FILES["file"]["error"] > 0) {
			echo "<p><strong>Error:</strong> ".$_FILES["file"]["error"]."</p>";
			putForm();
		} elseif (!in_array($extension, $allowedExts)) {
			echo "<p><strong>Error:</strong> Not a <a href=\"http://fabmetheus.crsndoo.com/wiki/index.php/Skeinforge#File_Formats\" title=\"Supported filetypes\" >supported file</a>.</p>";
			putForm();
		} elseif ($profile == ".none") {
			echo "<p><strong>Error:</strong> Select a profile!</p>";
			putForm();
		} else {
			$counter = 0;
			$basename = str_replace(" ","_",substr($_FILES["file"]["name"],0,-strlen($extension))).$counter;
			$filename = $basename.".".$extension;
			while (file_exists("files/".$filename)) {
				$counter++;
				$basename = str_replace(" ","_",substr($_FILES["file"]["name"],0,-strlen($extension))).$counter;
				$filename = $basename.".".$extension;
			}
			move_uploaded_file($_FILES["file"]["tmp_name"],"files/".$filename);
			$whoami = exec('whoami');
			$fullpath = 'files/';
			exec('cp -ar ../prefdir '.$fullpath.$basename.'.dir');
			exec('echo -e "Profile Selection:\t'.$profile.'" >> '.$fullpath.$basename.'.dir/profiles/extrusion.csv');
			$skeinforge = 'python ../libs/skeinforge_application/skeinforge.py -p '.$fullpath.$basename.'.dir';
			exec($skeinforge.' '.$fullpath.$filename.' > '.$fullpath.$basename.'.log 2>&1 & echo $! > '.$fullpath.$basename.'.pid',$output,$exitcode);
			echo '<pre id="terminal">';
			echo '$ skeinforge '.$filename."\n";
			echo '</pre>';
			echo '<script type="text/javascript">'."\n";
			echo '<!--'."\n";
			echo 'window.location = "/?job='.$basename.'.'.$extension.'";'."\n";
			echo '//-->'."\n";
			echo '</script>'."\n";
			echo "<noscript><p><strong>Continue:</strong> <a href=\"/?job=".$basename.".".$extension."\">".$basename.".".$extension."</a></p></noscript>"."\n";
		}
	} elseif($_GET["job"] != "") {
		if(file_exists("files/".$_GET["job"])) {
			$basename = $_GET["job"];
			$extension = strtolower(end(explode(".", $basename)));
			$basename = substr($basename,0,-strlen($extension)-1);
			$pid = trim(file_get_contents("files/".$basename.'.pid'));
			$grep = trim(exec('ps -eo pid | sed -e \'s/^[[:space:]]*//\' | grep \'^'.$pid.'$\''));
			if ($grep != $pid) {
				dwnLink($basename);
			}
			$whoami = exec('whoami');
			$fullpath = '/var/lib/stickshift/'.$whoami.'/app-root/runtime/repo/';
			echo '<pre id="terminal">';
			echo '$ skeinforge '.$basename.".".$extension."\n";
			$logtext = file_get_contents("files/".$basename.'.log');
			echo str_replace($fullpath,"",$logtext);
			echo '</pre>';
			
			if ($grep != $pid) {
				dwnLink($basename);
			} else {
				echo '<script type="text/javascript">'."\n";
				echo '<!--'."\n";
				echo 'setTimeout(function() {loadLog("'.$basename.'");},1000);'."\n";
				echo '//-->'."\n";
				echo '</script>'."\n";
				echo "<noscript><p><strong>Continue:</strong> <a href=\"/?job=".$basename.".".$extension."\">".$basename.".".$extension."</a></p></noscript>"."\n";
			}
		} else {
			echo "<p><strong>Error:</strong> Bad job.</p>";
		}
	} else {
		putForm();
		?>
	<h2>Warning</h2>
	<p>This service is BETA! It is provided as is and without any express or implied warranties, including, without limitation, the implied warranties of merchantability and fitness for a particular purpose. Uploaded files aren't protected, anyone can steel them.</p>
	<h2>TODO</h2>
	<ul>
		<li>Support multiply</li>
		<li>Support user uploaded profiles</li>
		<li>Security :P</li>
		<li>Ajax?</li>
	</ul>
	<?php } ?>
	<p><a href="http://fabmetheus.crsndoo.com/wiki/index.php/Skeinforge">Skeinforge</a> &copy; Enrique Perez (AGPLv3)<br />This service &copy; <a href="http://hroncok.cz/">Miro Hrončok</a>, <a href="https://3dprint.fit.cvut.cz/">3D Print Lab FIT CTU</a></p>
</body>
</html>
