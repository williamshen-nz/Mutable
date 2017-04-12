/**
 * Constants for the messages when updating options
 */
const SUCCESS = '<p class="success">Successfully saved!</p>';
const INVALID = '<p class="failure">Invalid URL!</p>';
const EXISTS = '<p class="failure">URL already exists!</p>';
const ADDED = '<p class="success">Successfully added!</p>';
const REMOVED = '<p class="success">Successfully removed!</p>';
const NO_ITEM = '<p class="failure">No item selected!</p>';

/**
 * Check if a URL is valid using a regular expression
 */
function validURL(url) {
    var pattern = new RegExp('((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
        '(\\?[;&a-z\\d%_.~+=-]*)?' +
        '(\\#[-a-z\\d_]*)?$', 'i');
    return pattern.test(url)
}

/**
 * Clean a URL and return root domain (including sub-domains)
 * Modified from: http://stackoverflow.com/questions/25703360/
 */
function getDomain(url) {
    if (url.indexOf('://') == -1)
        url = 'https://' + url;
    var a = document.createElement('a');
    a.setAttribute('href', url);
    return a.hostname;
}

/**
 * Insert a message into the given `div` wrapper
 */
function insertHTML(id, html) {
    var wrapper = document.getElementById(id);
    // If the last element is already a message, we remove it
    if (wrapper.lastElementChild.className === 'success' || wrapper.lastElementChild.className === 'failure') {
        wrapper.lastElementChild.remove();
    }
    wrapper.insertAdjacentHTML('beforeend', html);
    // Remove the message after 3 seconds
    setTimeout(function () {
        if (wrapper.lastElementChild.className === 'success' || wrapper.lastElementChild.className === 'failure') {
            wrapper.lastElementChild.remove();
        }
    }, 3000);
}

/**
 * Get the stored user options and load them into the checkbox and select option box
 */
function restoreOptions() {
    chrome.storage.sync.get({
        currentWindowOnly: false,
        blockedURLs: []
    }, function (items) {
        document.getElementById('current-window').checked = items.currentWindowOnly;
        refreshBlacklist(items.blockedURLs, false);
    });
}

/**
 * Save the new checkbox option for 'Search for tabs in the current window only' and show a success message
 */
function saveWindowOption() {
    chrome.storage.sync.get({currentWindowOnly: false}, function () {
        var checked = document.getElementById('current-window').checked;
        chrome.storage.sync.set({currentWindowOnly: checked}, function () {
            insertHTML('general', SUCCESS);
        });
    });
}

/**
 * Add a new URL to the list of blocked URLs in the user settings
 */
function addBlacklistURL() {
    var url = document.getElementById('blacklist-url').value;
    url = getDomain(url);   // clean the URL to its domain
    // If the url is invalid, show a message and exit the function
    if (url.length == 0 || !validURL(url)) {
        insertHTML('blacklist-add', INVALID);
        return;
    }
    // Get the existing list of blocked URLs, check if the url already exists and push and set it as required
    chrome.storage.sync.get({blockedURLs: []}, function (obj) {
        var urls = obj.blockedURLs;
        if (urls.indexOf(url) > -1) {
            insertHTML('blacklist-add', EXISTS);
            return;
        }
        urls.push(url);
        chrome.storage.sync.set({blockedURLs: urls}, function () {
            insertHTML('blacklist-add', ADDED);
            refreshBlacklist(url, true);
        });
    });
}

/**
 * Given a URL or list of URLs, update the select option blacklist box with these new additions
 */
function refreshBlacklist(url, newURL) {
    document.getElementById('blacklist-url').value = '';
    if (newURL) {
        // Append the new URL to the end of the existing ones
        document.getElementById('blacklisted').innerHTML += '<option value=' + url + '>' + url + '</option>';
    } else {
        // Go through each of the new URLs, build a total HTML string and set the blacklist box
        var total = '';
        url.forEach(function (url) {
            total += '<option value=' + url + '>' + url + '</option>\n';
        });
        document.getElementById('blacklisted').innerHTML = total;
    }
}

/**
 * Handle when the user clicks 'Remove' to remove an item/items from the blacklist
 */
function removeClick() {
    var options = document.getElementById('blacklisted').selectedOptions;
    // If no options have been selected, show that as a message
    if (options.length == 0)
        insertHTML('blacklist-remove', NO_ITEM);
    // Create an array of the values (i.e. URLs) of the options
    var urls = [];
    for (var i = 0; i < options.length; i++)
        urls.push(options[i].value);
    // Remove the URLs
    removeURLs(urls);
}

/**
 * Given a list of URLs, we remove them from the blocked URLs list of the user settings
 */
function removeURLs(toRemove) {
    chrome.storage.sync.get({blockedURLs: []}, function (obj) {
        // Remove the newly removed URLs from the user settings list
        var urls = obj.blockedURLs;
        urls = urls.filter(function (url) {
            return toRemove.indexOf(url) == -1;
        });
        // Set the user settings to the new blacklisted URLs, display a message and refresh the blacklist box
        chrome.storage.sync.set({blockedURLs: urls}, function () {
            insertHTML('blacklist-remove', REMOVED);
            refreshBlacklist(urls, false);
        });
    });
}

/**
 * We run this code when the options page is opened
 */
document.addEventListener('DOMContentLoaded', function () {
    // Restore state from current user settings
    restoreOptions();

    // Create event listener for the checkbox
    document.getElementById('current-window').addEventListener('click', function () {
        saveWindowOption();
    });

    // Create event listener in the Blacklist text box which listens for the 'Enter' key
    document.getElementById('blacklist-url').addEventListener('keydown', function (e) {
        if (e.keyCode == '13')
            addBlacklistURL();
    });

    // Create event listeners for adding blacklist URLs and removing them
    document.getElementById('url-submission').addEventListener('click', function () {
        addBlacklistURL();
    });

    document.getElementById('link-remove').addEventListener('click', function () {
        removeClick();
    });
});

