 /*returns an array of all tabs. Requires a callback function since it's an asynchronous method*/

function getAllTabs(callback) {
  alert("Inside the function")
  chrome.tabs.query({currentWindow: true}, function(originalTabs) {
    callback(originalTabs);
  });
  alert("End of getAllTabs")
}


/*Once the extension is clicked, it calls the getAllTabs method, filters those that have the sound property
 - note that paused videos are not the same as muted videos

 And for each of the tabs it creates a row in the corresponding HTML table
 What raemins is to add something like a button that is in front of each title to mute/unmute the corresponding tab
 */
document.addEventListener('DOMContentLoaded', function() {
  alert("Event Listener")
  var relevantTabs = [];
  alert("calling getAllTabs");
  getAllTabs(function(tabs) {
    alert("Getting all tabs")
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].audible || tabs[i].muted) {
        relevantTabs.push(tabs[i])
      }
    }
    var tableRef = document.getElementById('listOfTabs').getElementsByTagName('tbody')[0];
    for (var i = 0; i < relevantTabs.length; i++) {
    var newRow   = tableRef.insertRow(tableRef.rows.length);
    var newCell  = newRow.insertCell(0);
    var newText  = document.createTextNode(relevantTabs[i].title);
    var newCell2 = newRow.insertCell(1);
    var newText2 = document.createTextNode('aye..')
    newCell.appendChild(newText);
    }
  });
});