/**
 * The code here is used to build a button with the relevant icons and
 * text, and then insert it into the popup HTML page.
 */

const INIT = '<button id="';
const BUTTON = '" class="btn-tab">';
const MUTED = '<i class="fa fa-volume-off" aria-hidden="true" style="color: #F44336"></i>';
const UNMUTED = '<i class="fa fa-volume-up" aria-hidden="true" style="color: #4CAF50"></i>';
const TITLE = '<span class="tab-title">';
const CLOSE = '</span></button>';

/**
 * Given whether the tab is being muted or not, its title and id - we create a button containing
 * the speaker icon and title of the tab setting the ID to the button for event handlers
 */
function getButtonHTML(isMuted, title, id) {
    return INIT + id + BUTTON + (isMuted ? MUTED : UNMUTED) + TITLE + title + CLOSE;
}

/**
 * Given whether the tab is being muted or not and its title, we generate the new inner HTML
 * for an existing button which we edit.
 */
function getInnerHTML(isMuted, title) {
    return (isMuted ? MUTED: UNMUTED) + TITLE + title + '</span>';
}

