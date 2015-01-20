// ==UserScript==
// @name         Meduzach
// @version      0.1
// @updateURL    https://raw.github.com/Juribiyan/meduzach/master/meduzach.meta.js
// @description  Disqus comments for Meduza.io
// @author       Juribiyan
// @match        meduza.io/*
// @grant        none
// ==/UserScript==

var disqus_shortname = 'meduza';

/* Detect node insertion (.PopupBody) using animation */
	/* Add CSS */
var css = '@keyframes puk{from{clip:rect(1px,auto,auto,auto)}to{clip:rect(0,auto,auto,auto)}}@-moz-keyframes puk{from{clip:rect(1px,auto,auto,auto)}to{clip:rect(0,auto,auto,auto)}}@-webkit-keyframes puk{from{clip:rect(1px,auto,auto,auto)}to{clip:rect(0,auto,auto,auto)}}@-ms-keyframes puk{from{opacity:.999}to{opacity:1}}@-o-keyframes puk{from{clip:rect(1px,auto,auto,auto)}to{clip:rect(0,auto,auto,auto)}}.PopupBody{animation-duration:.001s;-o-animation-duration:.001s;-ms-animation-duration:.001s;-moz-animation-duration:.001s;-webkit-animation-duration:.001s;animation-name:puk;-o-animation-name:puk;-ms-animation-name:puk;-moz-animation-name:puk;-webkit-animation-name:puk}';
var head = document.head || document.getElementsByTagName('head')[0],
style = document.createElement('style');
style.type = 'text/css';
style.id = 'pukdetector';
if (style.styleSheet) {
	style.styleSheet.cssText = css;
} else {
	style.appendChild(document.createTextNode(css));
}
head.appendChild(style);
	/* Add event listener */
var insertListener = function(event) {
	if (event.animationName == "puk") putComments();
}
document.addEventListener("animationstart", insertListener, false); // standard + firefox
document.addEventListener("MSAnimationStart", insertListener, false); // IE
document.addEventListener("webkitAnimationStart", insertListener, false); // Chrome + Safari

/* Put comments block */
function putComments() {
	/* Define page ID and title */
	var slug = document.location.pathname,
	title = document.getElementsByClassName('PopupHeader-title')[0].textContent;
	/* Remove previously attached scripts */
	removeByID('dqWrapper');
	removeByID('dqMainScript');
	/* Add a wrapper for comments */
	var thread = document.createElement('div');
	thread.id = 'disqus_thread';
	document.getElementsByClassName('PopupBody')[0].appendChild(thread);
	/* Add a script which will add another script */
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.id = 'dqWrapper';
	script.innerHTML = makeScript(slug, title);
	(document.getElementsByTagName("head")[0] || document.getElementsByTagName("body")[0]).appendChild(script);
}

/* utils */
function removeByID(id) {
	var el = document.getElementById(id);
	if(el !== null)	el.parentNode.removeChild(el);
}
function makeScript(d_id, d_title) {
	var output = 'var disqus_shortname="'+disqus_shortname+'";';;
	output += 'var disqus_identifier="'+d_id+'";'
	output += 'var disqus_title="'+d_title+'";';
	output += '!function(){var e=document.createElement("script");e.type="text/javascript",e.id="dqMainScript",e.async=!0,e.src="//"+"'+disqus_shortname+'"+".disqus.com/embed.js",(document.getElementsByTagName("head")[0]||document.getElementsByTagName("body")[0]).appendChild(e)}();';
	return output;
}
