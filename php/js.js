function loadLog(job,ext) {
	var xmlhttp;
	if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	} else {// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			document.getElementById("terminal").innerHTML="$ skeinforge "+job+"."+ext+"\n"+xmlhttp.responseText;
		}
	}
	xmlhttp.open("GET","files/"+job+".log",true);
	xmlhttp.send();
}

function dwnLink(job) {
	var xmlhttp;
	if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	} else {// code for IE6, IE5
		xmlhttp2=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4 && xmlhttp.status == 200){
			var linkHTML = "<p><strong>Download:</strong> <a href=\"files/"+job+"_export.gcode\">"+job+"_export.gcode</a> &mdash; Your files will be deleted in 24 hours.</p>\n";
			document.getElementById("topDwnLink").innerHTML=linkHTML;
			document.getElementById("bottomDwnLink").innerHTML=linkHTML;
			clearInterval(dwnInterval);
			clearInterval(refreshInterval);
		}
	}
	xmlhttp.open("GET","files/"+job+"_export.gcode",true);
	xmlhttp.send();
}
