// Saves options to chrome.storage
function save_options() {
  var currentWindow = document.getElementById('current-window').checked;

  chrome.storage.sync.set({
    currentWindowOnly: currentWindow,
  }, function() {
    alert("data saved")
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