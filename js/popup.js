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
    
    var relevantTabs = [];
    getAllTabs(function (tabs) {
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].audible || tabs[i].muted) {
                relevantTabs.push(tabs[i])
            }
        }
    /*The array relevantTabs contains a list of tabs all of which are either audible or muted
    Lookup https://developer.chrome.com/extensions/tabs#type-Tab for the properties of tabs

    */
        }
    });
    

    document.getElementById('mute-all').addEventListener('click', function() {
        document.getElementById('tab-controller').innerHTML = getButtonHTML(true, "MUTED ALL!");
    });

    document.getElementById('unmute-all').addEventListener('click', function() {
        document.getElementById('tab-controller').innerHTML = getButtonHTML(false, "UNMUTED ALL!");
    });

});