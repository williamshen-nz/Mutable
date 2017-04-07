/*
* Missing in this section:
*
* 1. check the validity of the url being added
* */


// Saves options to chrome.storage
function save_options() {
  var urls = [];
  var currentWindow = document.getElementById('current-window').checked;
  var url = document.getElementById('blacklist-url').value;
  var toBeAdded = true;
  url = url.replace(/\s/g, ""); // remove all white space from the url
    if (url === "" || url === null) {
      toBeAdded = false;
  }

  /*Check if url is valid?*/
  
  chrome.storage.sync.get({
    blockedURLs: []
  }, function(items) {
      urls = items.blockedURLs;
      if (urls.indexOf(url) > -1) toBeAdded = false; // do not add duplicates
      if(toBeAdded) {
          urls.push(url);
      }
      chrome.storage.sync.set({
      currentWindowOnly: currentWindow,
      blockedURLs: urls
      }, function() {
        console.log("The blacklisted urls are " + urls);
        if (toBeAdded) appendURLToList(url);
      });
  });

}


function clearTextBar(){
    document.getElementById('blacklist-url').value = '';
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    var blocked = [];

    chrome.storage.sync.get({
      currentWindowOnly: false,
      blockedURLs: []
    }, function(items) {
    document.getElementById('current-window').checked = items.currentWindowOnly;
    blocked = items.blockedURLs;

    for (var i = 0; i < blocked.length; i++) {
        appendURLToList(blocked[i]);
    }

    });
}

/*only to be called once, when the document is loaded. It adds the close option in front of the existing urls*/
function addCrosses(listOfURLs){
    var i;
    for (i = 0; i < listOfURLs.length; i++) {
        var span = document.createElement("span");
        var txt = document.createTextNode("\u00D7"); // The cross symbol
        span.className = "close";
        span.appendChild(txt);
        listOfURLs[i].appendChild(span);
    }
}


function appendURLToList(url){
    var li = document.createElement("li");
    var urlText = document.createTextNode(url);
    li.appendChild(urlText);
    document.getElementById("blacklisted").appendChild(li);
    var close = document.getElementsByClassName("close");

    var span = document.createElement("span");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    li.appendChild(span);
    closeButtonEventListeners();

}

function removeURL(url){
    chrome.storage.sync.get({
        blockedURLs: []
    }, function(items) {
        urls = items.blockedURLs;
        var index = urls.indexOf(url);
        if (index > -1) {
            urls.splice(index, 1);
        }else {
            console.log("Something is wrong here. The url to be deleted cannot be found.")
        }
        chrome.storage.sync.set({
            blockedURLs: urls
        }, function() {
            console.log("Removed "+ url + ", the remaining ones are " + urls)
        });
    });
}

function closeButtonEventListeners(){
    var close = document.getElementsByClassName("close");
    for (i = 0; i < close.length; i++) {
        close[i].onclick = function() {
            var div = this.parentElement;
            div.style.display = "none";
            removeURL(div.childNodes.item(0).nodeValue);
        }
    }
}

document.addEventListener('DOMContentLoaded', function(){
    restore_options();
    document.getElementById('current-window').addEventListener('click', save_options);
    document.getElementById('url-submission').addEventListener('click', function() {
        save_options();
        clearTextBar();
    });
    var myNodelist = document.getElementsByTagName("li");
    addCrosses(myNodelist);
    closeButtonEventListeners();
});

