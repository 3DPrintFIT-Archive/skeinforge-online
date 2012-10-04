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
			if (textfile.responseText[0] == "e") {
				return 1;
			}
		}
	}
	textfile.open("GET","files/"+job+".exit",true);
	textfile.send();
	return 0;
}

function dwnLink(job) {
	if (1==1) {
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
			//clearInterval(dwnInterval);
			//clearInterval(refreshInterval);
		}
	}
}

