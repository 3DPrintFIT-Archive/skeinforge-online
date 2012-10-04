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
	document.getElementById("infobox").innerHTML="Checking end of the job";
	var textfile;
	var retvalue = 0;
	if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
		textfile=new XMLHttpRequest();
	} else {// code for IE6, IE5
		textfile=new ActiveXObject("Microsoft.XMLHTTP");
	}
	textfile.open("GET","files/"+job+".exit",true);
	textfile.send();
	if (textfile.readyState==4) {
		if (textfile.status == 200) {
			document.getElementById("infobox").innerHTML="The file exists";
			if (textfile.responseText[0] == "e") {
				document.getElementById("infobox").innerHTML="The file contains end mark";
				retvalue = 1;
			} else {
				document.getElementById("infobox").innerHTML="Doesn't contain end mark";
			}
		} else {
			document.getElementById("infobox").innerHTML="File not present";
		}
	} else {
		document.getElementById("infobox").innerHTML="File not ready";
	}
	//document.getElementById("infobox").innerHTML="Returning "+retvalue;
	return retvalue;
}

function dwnLink(job) {
	if (checkEnd(job)==1) {
		var textfile;
		var linkHTML="";
		if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
			textfile=new XMLHttpRequest();
		} else {// code for IE6, IE5
			textfile=new ActiveXObject("Microsoft.XMLHTTP");
		}
		textfile.open("HEAD","files/"+job+"_export.gcode",true);
		textfile.send();
		if (textfile.readyState==4 && textfile.status == 200) {
			linkHTML = "<strong>Download:</strong> <a href=\"files/"+job+"_export.gcode\">"+job+"_export.gcode</a> &mdash; Your files will be deleted in 24 hours.";
		} else {
			linkHTML = "<strong>Error:</strong> The procces ended without gcode, see the log";
		}
		if (linkHTML!="") {
			document.getElementById("topDwnLink").innerHTML=linkHTML;
			document.getElementById("bottomDwnLink").innerHTML=linkHTML;
			clearInterval(dwnInterval);
			clearInterval(refreshInterval);
		}
	}
}

