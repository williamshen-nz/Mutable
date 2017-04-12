/**
 * This function returns an array of all the tabs of the current window or across all windows.
 */
function getAllTabs(currentWindowOnly, callback) {
    if (currentWindowOnly) {
        chrome.tabs.query({currentWindow: true}, function (originalTabs) {
            callback(originalTabs);
        });
    } else {
        chrome.tabs.query({}, function (originalTabs) {
            callback(originalTabs);
        });
    }
}

/**
 *  Given a single tab, we toggle the sound, update the button icon and set the muted property on the tab
 *  Chrome does not automatically update 'tab.mutedInfo.muted' on change of the muted property
 */
function toggleSound(tab) {
    if (tab.mutedInfo.muted) {
        chrome.tabs.update(tab.id, {muted: false});
        tab.mutedInfo.muted = false;
        document.getElementById(tab.id).innerHTML = getInnerHTML(false, tab.title);
    } else {
        chrome.tabs.update(tab.id, {muted: true});
        tab.mutedInfo.muted = true;
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

    chrome.storage.sync.get({currentWindowOnly: false}, function (obj) {
        // Get the tabs based on the user settings of currentWindowOnly
        getAllTabs(obj.currentWindowOnly, function (tabs) {
            tabs.forEach(function (tab) {
                // Build the relevant HTML, push it and create the event listener
                if (tab.mutedInfo.muted || tab.audible) {
                    relevantTabs.push(tab);
                    tabController.insertAdjacentHTML('beforeend', getButtonHTML(tab.mutedInfo.muted ? true : false, tab.title, tab.id));
                    document.getElementById(tab.id).addEventListener('click', function () {
                        toggleSound(tab);
                    });
                }
            })
        });
    });

    // Add event listeners for the buttons that toggle sound for all the relevant tabs
    document.getElementById('mute-all').addEventListener('click', function () {
        toggleTabs(relevantTabs, true);
    });

    document.getElementById('unmute-all').addEventListener('click', function () {
        toggleTabs(relevantTabs, false);
    });

    // Add event listener to open options page on click of settings cog
    document.getElementById('settings').addEventListener('click', function () {
        chrome.tabs.create({url: "options.html"});
    });
});