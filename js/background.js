// Variable to store all the blocked domain names
var blockedDomains = [];

/**
 * Clean a URL and return root domain (including sub-domains)
 * Modified from: http://stackoverflow.com/questions/25703360/
 */
function getDomain(url) {
    if (url.indexOf('://') === -1)
        url = 'https://' + url;
    var a = document.createElement('a');
    a.setAttribute('href', url);
    return a.hostname;
}

/**
 * Given a tab as argument, the function sets its muted property to true
 */
function muteTab(tab) {
    chrome.tabs.update(tab.id, {muted: true});
    tab.mutedInfo.muted = true;
}

/**
 * This function checks if the given tab needs to be muted, and if so it calls the muteTab function
 */
function muteNewTab(tab) {
    if (blockedDomains.indexOf(getDomain(tab.url)) > -1 && tab.audible)
        muteTab(tab);
}

/**
 * If a tab is updated, we check if the tab needs to be muted and call the muteTab function as required
 */
function muteNewURL(tabId, changeInfo, tab) {
    console.log("mute new url");
    if (blockedDomains.indexOf(getDomain(tab.url)) > -1 && changeInfo.audible && tab.audible)
        muteTab(tab);
}

/**
 * This function creates all the event listeners that are required to detect changes in settings/tabs
 */
function begin() {
    // Get the user preferences and add to blockedDomains, and add a listener to detect new audible tabs
    chrome.storage.sync.get({blockedURLs: []}, function (object) {
        blockedDomains = [];
        object.blockedURLs.forEach(function(url) {
           blockedDomains.push(url);
        });
        // Add event listeners into place
        chrome.tabs.onCreated.addListener(muteNewTab);
        chrome.tabs.onUpdated.addListener(muteNewURL);
    });

    // Create an event listener to detect changes in the Chrome storage - i.e. user settings
    chrome.storage.onChanged.addListener(function (changes, areaName) {
        chrome.storage.sync.get({blockedURLs: []}, function (obj) {
            blockedDomains = [];
            obj.blockedURLs.forEach(function(url) {
                blockedDomains.push(url);
            });
            console.log(blockedDomains);
            // Remove any existing event listeners
            chrome.tabs.onCreated.removeListener(muteNewTab);
            chrome.tabs.onUpdated.removeListener(muteNewURL);
            // Add new event listeners into place
            chrome.tabs.onCreated.addListener(muteNewTab);
            chrome.tabs.onUpdated.addListener(muteNewURL);
        })
    })
}

begin();