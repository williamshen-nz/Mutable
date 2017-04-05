/*returns an array of all tabs. Requires a callback function since it's an asynchronous method*/

function getAllTabs(callback) {
    chrome.tabs.query({currentWindow: true}, function (originalTabs) {
        callback(originalTabs);
    });
}

/*toggles sound given a tab*/
function toggleSound(tab) {
    if (tab.audible) {
        chrome.tabs.update(tab.id, {muted: true})
    }
    else {
        chrome.tabs.update(tab.id, {muted: false})
    }
}

/*Sorry for the bad function name, depending on the boolean mute value, it mutes or unmutes tabs that are passed to it*/
function muteTabs(tabs) {
    for (var i = 0; i < tabs.length; i++) {
        chrome.tabs.update(tabs[i].id, {muted: true})
    }
}

function unmuteTab(tabs) {
    for (var i = 0; i < tabs.length; i++) {
        chrome.tabs.update(tabs[i].id, {muted: false})
    }
}

/*Once the extension is clicked, it calls the getAllTabs method, filters those that have the sound property
 - note that paused videos are not the same as muted videos

 And for each of the tabs it creates a row in the corresponding HTML table
 What raemins is to add something like a button that is in front of each title to mute/unmute the corresponding tab
 */
document.addEventListener('DOMContentLoaded', function () {
    /*
    var relevantTabs = [];
    getAllTabs(function (tabs) {
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].audible || tabs[i].muted) {
                alert("Found relevant tab");
                relevantTabs.push(tabs[i])
            }
        }
        var containerRef = document.getElementById("listOfTabs");
        console.log(containerRef)
        for (var i = 0; i < relevantTabs.length; i++) {
            var newRow = document.createElement("div");
            newRow.className = "row";
            containerRef.appendChild(newRow);

            var tabTitleDiv = document.createElement("div");
            tabTitleDiv.className = "col-xs-9 bg-info";
            tabTitleDiv.innerHTML = relevantTabs[i].title;
            var buttonDiv = document.createElement("div");
            buttonDiv.className = "col-xs-3 bg-warning";
            buttonDiv.innerHTML = "blah"
            newRow.appendChild(tabTitleDiv);
            newRow.appendChild(buttonDiv);
        }
    });
    */

    document.getElementById('mute-all').addEventListener('click', function() {
        document.getElementById('tab-controller').innerHTML = getButtonHTML(true, "MUTED ALL!");
    });

    document.getElementById('unmute-all').addEventListener('click', function() {
        document.getElementById('tab-controller').innerHTML = getButtonHTML(false, "UNMUTED ALL!");
    });

});