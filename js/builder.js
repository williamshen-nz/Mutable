/**
 * The code here is used to build a button with the relevant icons and
 * text, and then insert it into the popup HTML page.
 */

const BUTTON = '<button class="btn-tab">';
const MUTED = '<i class="fa fa-volume-off" aria-hidden="true"></i>';
const UNMUTED = '<i class="fa fa-volume-up" aria-hidden="true"></i>';
const TITLE = '<span class="tab-title">';
const CLOSE = '</span></button>';

function getButtonHTML(isMuted, title) {
    return BUTTON + (isMuted ? MUTED : UNMUTED) + TITLE + title + CLOSE;
}

