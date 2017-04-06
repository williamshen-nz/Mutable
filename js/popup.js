/**
 * This function returns an array of all the tabs of the current window. It requires a callback as it is asynchronous.
 */
function getAllTabs(callback) {
    chrome.tabs.query({}, function (originalTabs) {
        callback(originalTabs);
    });
}

function showSettings(){
    window.open('options.html');
}

/**
 *  Given a single tab, we toggle the sound, update the button icon and set the muted property on the tab
 */
function toggleSound(tab) {
    if (tab.mutedInfo.muted) {
        chrome.tabs.update(tab.id, {muted: false});
        tab.mutedInfo.muted = false;    // Chrome doesn't automatically do this...
        document.getElementById(tab.id).innerHTML = getInnerHTML(false, tab.title);
    } else {
        chrome.tabs.update(tab.id, {muted: true});
        tab.mutedInfo.muted = true;     // Chrome doesn't automatically do this...
        document.getElementById(tab.id).innerHTML = getInnerHTML(true, tab.title);
    }
}

/**
 * For each tab of an array of tabs, we toggle it to one value and update the icon accordingly
 */
function toggleTabs(tabs, isMuted) {
    tabs.forEach(function (tab) {
        chrome.tabs.update(tab.id, {muted: (isMuted ? true : false)});
        document.getElementById(tab.id).innerHTML = getInnerHTML(isMuted ? true : false, tab.title);
        tab.mutedInfo.muted = isMuted;
    });
}

/**
 * This is the code we run when the popup menu is clicked on the Chrome extension toolbar
 */
document.addEventListener('DOMContentLoaded', function () {
    // We grab our tab controller and initialise an empty array
    var tabController = document.getElementById('tab-controller');
    var relevantTabs = [];

    // We iterate through each of the tabs of the current window
    getAllTabs(function (tabs) {
        tabs.forEach(function (tab) {
            // Add the tab to the array and append buttons to HTML and add event handlers as required.
            if (tab.incognito) {
                return;
            }

            if (tab.mutedInfo.muted) {
                relevantTabs.push(tab);
                tabController.insertAdjacentHTML('beforeend', getButtonHTML(true, tab.title, tab.id));
                document.getElementById(tab.id).addEventListener('click', function() {
                    toggleSound(tab);
                });

            } else if (tab.audible) {
                relevantTabs.push(tab);
                tabController.insertAdjacentHTML('beforeend', getButtonHTML(false, tab.title, tab.id));
                document.getElementById(tab.id).addEventListener('click', function() {
                    toggleSound(tab);
                });
            }

        });
        // If no relevant tabs found
        if (relevantTabs.length == 0) {
            tabController.innerHTML = "No audible/muted tabs found!"
            document.getElementById('mute-all').style.display='none';
            document.getElementById('unmute-all').style.display='none';
        }
        
    });

    // Add event listeners for the buttons that toggle sound for all the relevant tabs
    document.getElementById('mute-all').addEventListener('click', function() {
        toggleTabs(relevantTabs, true);
    });

    document.getElementById('unmute-all').addEventListener('click', function() {
        toggleTabs(relevantTabs, false);
    });

    var settings = document.getElementById('settings');
    settings.addEventListener('click', function(){
        showSettings();
    })

});
