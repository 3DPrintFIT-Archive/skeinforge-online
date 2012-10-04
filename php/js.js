function loadLog(job,ext) {
	var textfile;
	if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
		textfile=new XMLHttpRequest();
	} else {// code for IE6, IE5
		textfile=new ActiveXObject("Microsoft.XMLHTTP");
	}
	textfile.onreadystatechange=function() {
		if (textfile.readyState==4 && textfile.status==200) {
			document.getElementById("terminal").innerHTML="$ skeinforge "+job+"."+ext+"\n"+textfile.responseText;
		}
	}
	textfile.open("GET","files/"+job+".log",true);
	textfile.send();
}

function checkEnd(job) {
	var textfile;
	if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
		textfile=new XMLHttpRequest();
	} else {// code for IE6, IE5
		textfile=new ActiveXObject("Microsoft.XMLHTTP");
	}
	textfile.onreadystatechange=function() {
		if (textfile.readyState==4 && textfile.status == 200) {
			document.write(textfile.responseText[1]);
			if (textfile.responseText == "end\n") {
				return 1;
			}
		}
	}
	textfile.open("GET","files/"+job+".exit",true);
	textfile.send();
	return 0;
}

function dwnLink(job) {
	var textfile;
	var linkHTML;
	if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
		textfile=new XMLHttpRequest();
	} else {// code for IE6, IE5
		textfile=new ActiveXObject("Microsoft.XMLHTTP");
	}
	textfile.onreadystatechange=function() {
		if (textfile.readyState==4 && checkEnd(job)) {
			if (textfile.status == 404) {
				linkHTML = "<strong>Error:</strong> The procces ended without gcode, see the log";
			}
			if (textfile.status == 200) {
				linkHTML = "<strong>Download:</strong> <a href=\"files/"+job+"_export.gcode\">"+job+"_export.gcode</a> &mdash; Your files will be deleted in 24 hours.";
			}
			if ((textfile.status == 200) || (textfile.status == 404)) {
				document.getElementById("topDwnLink").innerHTML=linkHTML;
				document.getElementById("bottomDwnLink").innerHTML=linkHTML;
				clearInterval(dwnInterval);
				clearInterval(refreshInterval);
			}
		}
	}
	textfile.open("GET","files/"+job+"_export.gcode",true);
	textfile.send();
}
