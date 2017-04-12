var blockedDomains = [];

/**
 * Got this from http://stackoverflow.com/a/23945027/6063947
 *
 * The function extracts the domain name given the url as an argument. It may be preceded by https or any other protocol
 * */
function getDomain(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get the hostname
    if (url.indexOf("://") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    var domain = hostname.split(':')[0];
        splitArr = domain.split('.'),
        arrLen = splitArr.length;

    //extracting the root domain here
    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
    }
    return domain;
}

/**
 * Given a tab as argument, the function sets its muted property to true
 * */
function muteTab(tab) {
    if (tab.icognito) {
        return;
    }
    chrome.tabs.update(tab.id, {muted: true});
    tab.mutedInfo.muted = true;
}

/**
 * This function checks if the given tab needs to be muted, and if so it calls the muteTab function
 * */
function muteNewTab(tab) {
    if (blockedDomains.indexOf(getDomain(tab.url)) > -1 && tab.audible) { // if the new tab's url belongs to the blocked ones
        muteTab(tab);
    }
}

/**
 * If a tab is updated (for example it may be reloaded), the function checks if the tab needs to be muted and
 * calls the muteTab function if required
 * */
function muteNewURL(tabId, changeInfo, tab) {
    // if the tab's url belongs to the blocked ones..
    if (blockedDomains.indexOf(getDomain(tab.url)) > -1 && tab.audible && changeInfo.audible) {
        console.log(changeInfo);
        console.log(tab);
        muteTab(tab);
    }
}

/**
 * This function creates all the event listeners that are required to detect changes in settings/tabs
 * */
function begin() {

    // Get the user preferences, and add a listener to detect new audible tabs
    chrome.storage.sync.get({blockedURLs: []}, function (object) {
        for (var i = 0; i < object.blockedURLs.length; i++) {
            blockedDomains[i] = getDomain(object.blockedURLs[i]);
        }
        chrome.tabs.onCreated.addListener(muteNewTab);
        chrome.tabs.onUpdated.addListener(muteNewURL);
    });

    // create an event listener to detect changes in the chrome storage. If changes are found, the previous event listeners
    // are removed and updated ones are created in place
    chrome.storage.onChanged.addListener(function (changes, areaName) {
        chrome.storage.sync.get({blockedURLs: []}, function (obj) {
            blockedDomains = [];
            for (var i = 0; i < obj.blockedURLs.length; i++) {
                blockedDomains[i] = getDomain(obj.blockedURLs[i]);
            }
            chrome.tabs.onCreated.removeListener(muteNewTab);
            chrome.tabs.onUpdated.removeListener(muteNewURL);
            chrome.tabs.onCreated.addListener(muteNewTab);
            chrome.tabs.onUpdated.addListener(muteNewURL);
        })
    })
}

begin();