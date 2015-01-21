// ==UserScript==
// @name         Meduzach
// @version      0.2
// @description  Disqus comments for Meduza.io
// @author       Juribiyan
// @match        https://meduza.io/*
// @grant        none
// ==/UserScript==

var disqus_shortname = 'meduza';
var pristine = true;

/* Detect node insertion (.PopupBody) using animation */
	/* Add CSS */
var css = '#disqus_thread{padding: 0 50px;color:#000;}#disqus_thread a{color: #B38D59;}#disqus_thread a:hover{color:#000;}@keyframes puk{from{clip:rect(1px,auto,auto,auto)}to{clip:rect(0,auto,auto,auto)}}@-moz-keyframes puk{from{clip:rect(1px,auto,auto,auto)}to{clip:rect(0,auto,auto,auto)}}@-webkit-keyframes puk{from{clip:rect(1px,auto,auto,auto)}to{clip:rect(0,auto,auto,auto)}}@-ms-keyframes puk{from{opacity:.999}to{opacity:1}}@-o-keyframes puk{from{clip:rect(1px,auto,auto,auto)}to{clip:rect(0,auto,auto,auto)}}.PopupBody{animation-duration:.001s;-o-animation-duration:.001s;-ms-animation-duration:.001s;-moz-animation-duration:.001s;-webkit-animation-duration:.001s;animation-name:puk;-o-animation-name:puk;-ms-animation-name:puk;-moz-animation-name:puk;-webkit-animation-name:puk}';
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

	/* Add a wrapper for comments */
	var thread = document.createElement('div');
	thread.id = 'disqus_thread';
	insertAfter(thread, document.getElementsByClassName('PopupBody')[0]);

	/* Load Disqus */
	if(pristine) {
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.id = 'dqSettings';
		script.innerHTML = makeScript(slug, title);
		(document.getElementsByTagName("head")[0] || document.getElementsByTagName("body")[0]).appendChild(script);
		var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
        dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
        pristine = false;
	}
	else {
		DISQUS.reset({
			reload: true,
			config: function () {  
				this.page.identifier = slug;  
				this.page.url = document.location.href;
				this.page.title = title;
			}
		});
	}
}

/* utils */

function makeScript(d_id, d_title) {
	var output = 'var disqus_shortname="'+disqus_shortname+'";';;
	output += 'var disqus_identifier="'+d_id+'";'
	output += 'var disqus_title="'+d_title+'";';
	return output;
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
