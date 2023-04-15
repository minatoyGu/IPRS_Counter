chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.startGuessing) {
      var input = document.activeElement;
      var code = 0;
      var observer = new MutationObserver(function(mutations) {
        clearInterval(intervalId);
        observer.disconnect();
      });
      var intervalId = setInterval(function() {
        if (code <= 99999) {
          input.value = code.toString().padStart(5, "0");
          code++;
        } else {
          clearInterval(intervalId);
          observer.disconnect();
        }
      }, 1);
      observer.observe(document.documentElement, { childList: true, subtree: true });
    }
  });
  chrome.runtime.sendMessage({resumeGuessing: true});
