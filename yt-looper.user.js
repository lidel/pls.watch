// ==UserScript==
// @name        yt-looper
// @description Adds a button on YouTube to open current video in yt.aergia.eu looper
// @namespace   http://yt.aergia.eu
// @icon        http://youtube.com/favicon.ico
// @include     http://www.youtube.com/watch*
// @include     http://youtube.com/watch*
// @include     https://www.youtube.com/watch*
// @include     https://youtube.com/watch*
// @version     1.0
// @updateURL   https://raw.github.com/lidel/yt-looper/master/yt-looper.user.js
// @downloadURL https://raw.github.com/lidel/yt-looper/master/yt-looper.user.js
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// ==/UserScript==

var $secondaryActions = $('div.watch-secondary-actions');
var $button = $('<button class="yt-uix-button yt-uix-button-opacity yt-uix-button-has-icon"><span style="margin:0 0.1em;font-size:2.25em;vertical-align: middle;">&#x21BB;</span> yt.aergia.eu</button>');

$button.click(function() {
  window.open(window.location.href.replace(/.*youtube.com\/watch/, 'https://yt.aergia.eu/'));
});

$secondaryActions.prepend($button);
