/*
 * Missing in this section:
 *
 * 1. check the validity of the url being added
 * */

const SUCCESS = '<p class="success">Successfully saved!</p>';
const INVALID = '<p class="failure">Invalid URL!</p>';
const EXISTS = '<p class="failure">URL already exists!</p>';
const ADDED = '<p class="success">Successfully added!</p>';
const REMOVED = '<p class="success">Successfully removed!</p>';
const ERROR = '<p class="failure">Error! Please refresh the page and try again.</p>';
const NO_ITEM = '<p class="failure">No item selected!</p>';

function validURL() {
    return true;
}

function insertHTML(id, html) {
    document.getElementById(id).insertAdjacentHTML('beforeend', html)
}

function restoreOptions() {
    chrome.storage.sync.get({
        currentWindowOnly: false,
        blockedURLs: []
    }, function (items) {
        document.getElementById('current-window').checked = items.currentWindowOnly;
        updateBlacklist(items.blockedURLs, false);
    });
}

function saveWindowOption() {
    chrome.storage.sync.get({
        currentWindowOnly: false,
        blockedURLs: []
    }, function (obj) {
        var checked = document.getElementById('current-window').checked;
        chrome.storage.sync.set({currentWindowOnly: checked, blockedURLs: obj.blockedURLs}, function () {
            insertHTML('general', SUCCESS);
        });
    });
}

function addBlacklistURL() {
    var url = document.getElementById('blacklist-url').value;
    url = url.replace(/\s/g, ''); // remove all white space from the url
    if (url.length == 0 || !validURL()) {
        insertHTML('blacklist-add', INVALID);
        return;
    }

    chrome.storage.sync.get({
        currentWindowOnly: false,
        blockedURLs: []
    }, function (obj) {
        var urls = obj.blockedURLs;
        if (urls.indexOf(url) > -1) {
            insertHTML('blacklist-add', EXISTS);
            return;
        }

        urls.push(url);
        chrome.storage.sync.set({
            currentWindowOnly: obj.currentWindowOnly,
            blockedURLs: urls
        }, function () {
            insertHTML('blacklist-add', ADDED);
            updateBlacklist(url, true);
        });
    });
}

function updateBlacklist(url, newURL) {
    document.getElementById('blacklist-url').value = '';
    if (newURL) {
        var html = '<option value=' + url + '>' + url + '</option>';
        document.getElementById('blacklisted').innerHTML += html;
    } else {
        var total = '';
        url.forEach(function (url) {
            total += '<option value=' + url + '>' + url + '</option>\n';
        });
        document.getElementById('blacklisted').innerHTML = total;
    }
}

function removeClick() {
    var options = document.getElementById('blacklisted').selectedOptions;
    if (options.length == 0)
        insertHTML('blacklist-remove', NO_ITEM);
    for (var i = 0; i < options.length; i++)
        removeURL(options[i].value);
}

function removeURL(url) {
    chrome.storage.sync.get({ blockedURLs: [] }, function (obj) {
        var urls = obj.blockedURLs;
        var index = urls.indexOf(url);

        if (index > -1) {
            urls.splice(index, 1);
        } else {
            insertHTML('blacklist-remove', ERROR);
            return;
        }

        chrome.storage.sync.set({ blockedURLs: urls }, function () {
            insertHTML('blacklist-remove', REMOVED);
            updateBlacklist(urls, false);
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    restoreOptions();

    document.getElementById('current-window').addEventListener('click', function () {
        saveWindowOption();
    });

    document.getElementById('url-submission').addEventListener('click', function () {
        addBlacklistURL();
    });

    document.getElementById('link-remove').addEventListener('click', function () {
        removeClick();
    });
});

