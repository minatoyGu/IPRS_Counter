// global variables to keep track of guessing status
var guessing = false;
var paused = false;

// create context menu item
chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    title: "Guess code",
    contexts: ["editable"],
    id: "guess-code"
  });
});

// handle context menu item click
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "guess-code") {
    guessing = true;
    chrome.tabs.sendMessage(tab.id, {startGuessing: true});
  }
});

// handle messages from content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.pauseGuessing) {
    paused = true;
  } else if (request.continueGuessing) {
    paused = false;
  }
});

// detect changes on the page and pause guessing when needed
function handleChanges() {
    var inputElement = document.activeElement;
    var observer = new MutationObserver(function(mutations) {
      if (guessing && !paused && inputElement.value.length === 0) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          var tab = tabs[0];
          chrome.tabs.sendMessage(tab.id, {pauseGuessing: true});
        });
      }
    });
    observer.observe(inputElement, { childList: true, characterData: true, subtree: true });
  }
  

// start detecting changes when the extension is installed or updated
chrome.runtime.onInstalled.addListener(function() {
  handleChanges();
});

chrome.runtime.onStartup.addListener(function() {
  handleChanges();
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.pauseGuessing) {
      paused = true;
    } else if (request.continueGuessing) {
      paused = false;
    } else if (request.resumeGuessing) {
      paused = false;
      handleChanges();
    }
  });
  
