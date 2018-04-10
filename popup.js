window.onload = function() {
	var port = chrome.extension.connect({
      name: "Init"
	});

  port.postMessage("popup-init");
};
