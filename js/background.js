var blockedDomains = [];

/*
 * Got this from http://stackoverflow.com/a/23945027/6063947
 * */
function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get the hostname
    if (url.indexOf("://") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];

    return hostname;
}

function getDomain(url) {
    var domain = extractHostname(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length;

    //extracting the root domain here
    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
    }
    return domain;
}

function muteTab(tab) {
    if (tab.icognito) {
        return;
    }
    chrome.tabs.update(tab.id, {muted: true});
    tab.mutedInfo.muted = true;
}

function muteNewTab(tab) {
    if (blockedDomains.indexOf(getDomain(tab.url)) > -1 && tab.audible) { // if the new tab's url belongs to the blocked ones
        muteTab(tab);
    }
}

function muteNewURL(tabId, changeInfo, tab) {
    if (blockedDomains.indexOf(getDomain(tab.url)) > -1 && tab.audible && changeInfo.audible) { // if the tab's url belongs to the blocked ones
        console.log(changeInfo);
        console.log(tab);
        muteTab(tab);
    }
}

function begin() {
    chrome.storage.sync.get({blockedURLs: []}, function (object) {
        for (var i = 0; i < object.blockedURLs.length; i++) {
            blockedDomains[i] = getDomain(object.blockedURLs[i]);
        }
        chrome.tabs.onCreated.addListener(muteNewTab);
        chrome.tabs.onUpdated.addListener(muteNewURL);
    });

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