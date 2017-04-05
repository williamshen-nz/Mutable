/*returns an array of all tabs. Requires a callback function since it's an asynchronous method*/

function getAllTabs(callback) {
    chrome.tabs.query({currentWindow: true}, function (originalTabs) {
        callback(originalTabs);
    });
}

/*toggles sound given a tab*/
function toggleSound(tab) {
    if (tab.muted) {
        chrome.tabs.update(tab.id, {muted: false});
    } else {
        chrome.tabs.update(tab.id, {muted: true});
    }
}

function toggleTabs(tabs, isMuted) {
    tabs.forEach(function (tab) {
        chrome.tabs.update(tab.id, {muted: (isMuted ? true : false)})
    });
}

var relevantTabs = [];

/*Once the extension is clicked, it calls the getAllTabs method, filters those that have the sound property
 - note that paused videos are not the same as muted videos

 And for each of the tabs it creates a row in the corresponding HTML table
 What raemins is to add something like a button that is in front of each title to mute/unmute the corresponding tab
 */
document.addEventListener('DOMContentLoaded', function () {

    var tab_controller = document.getElementById('tab-controller');

    /*The array relevantTabs contains a list of tabs all of which are either audible or muted
     Lookup https://developer.chrome.com/extensions/tabs#type-Tab for the properties of tabs*/

    getAllTabs(function (tabs) {
        tabs.forEach(function (tab) {
            if (tab.audible) {
                relevantTabs.push(tab);
                tab_controller.insertAdjacentHTML('beforeend', getButtonHTML(false, tab.title, tab.id));
                document.getElementById(tab.id).addEventListener('click', function() {
                    toggleSound(tab);
                });
            } else if (!tab.audible) {
                relevantTabs.push(tab);
                tab_controller.insertAdjacentHTML('beforeend', getButtonHTML(true, tab.title, tab.id));
                document.getElementById(tab.id).addEventListener('click', function() {
                    toggleSound(tab);
                });
            }
        });
    });

    document.getElementById('mute-all').addEventListener('click', function() {
        toggleTabs(relevantTabs, true);
    });

    document.getElementById('unmute-all').addEventListener('click', function() {
        toggleTabs(relevantTabs, false);
    });

});
