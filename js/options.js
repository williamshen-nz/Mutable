// Saves options to chrome.storage
function save_options() {
  var urls = [];
  var currentWindow = document.getElementById('current-window').checked;
  var url = document.getElementById('blacklist-url').value;
  var toBeAdded = true;
  if (url === "" || url === null) {
      toBeAdded = false;
  }

  /*Check if url is valid?*/
  
  chrome.storage.sync.get({
    blockedURLs: []
  }, function(items) {
      urls = items.blockedURLs;
      if(toBeAdded) {
          urls.push(url);
      }
      chrome.storage.sync.set({
      currentWindowOnly: currentWindow,
      blockedURLs: urls
      }, function() {
        alert(urls)
      });
  });

}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    currentWindowOnly: false
  }, function(items) {
    document.getElementById('current-window').checked = items.currentWindowOnly;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('current-window').addEventListener('click',
    save_options);
document.getElementById('url-submission').addEventListener('click', save_options);