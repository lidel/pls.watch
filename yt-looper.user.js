// ==UserScript==
// @name        yt-looper
// @description Adds a button on YouTube, Imgur and SoundCloud to open current resource in yt.aergia.eu looper
// @namespace   https://yt.aergia.eu
// @icon        https://i.imgur.com/EGgL1nx.png
// @include     http://www.youtube.com/watch*
// @include     http://youtube.com/watch*
// @include     https://www.youtube.com/watch*
// @include     https://youtube.com/watch*
// @include     https://imgur.com/*
// @include     http://imgur.com/*
// @include     http://soundcloud.com/*
// @include     https://soundcloud.com/*
// @version     1.6.4
// @updateURL   https://yt.aergia.eu/yt-looper.user.js
// @downloadURL https://yt.aergia.eu/yt-looper.user.js
// @require     https://cdn.jsdelivr.net/jquery/3.0.0-beta1/jquery.min.js
// @grant       none
// ==/UserScript==
(function ($, undefined) { // eslint-disable-line no-unused-vars
  'use strict';
  var youtubeHandler = function () {
    var humanize = function (sec) {
      var sec_num = parseInt(sec, 10);
      var hours = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      var seconds = sec_num - (hours * 3600) - (minutes * 60);
      hours = hours > 0 ? (hours + 'h')  : '';
      minutes = minutes > 0 ? (minutes + 'm')  : '';
      seconds = seconds > 0 ? (seconds + 's')  : '';
      return sec === 0 ? '0s' : hours + minutes + seconds;
    };
    var getYtPlayer = function () {
      var doc = window.document;
      var ytplayer = doc.getElementById('movie_player') || doc.getElementById('movie_player-flash');
      return ytplayer;
    };
    var renderLooperActions = function() {
      $('#yt-looper-start').remove();
      $('#yt-looper-end').remove();
      $('#yt-looper').remove();
      $('#yt-looper-interval').remove();
      var $button = $('<button id="yt-looper" class="yt-uix-button yt-uix-button-opacity yt-uix-button-has-icon yt-uix-tooltip" title="Open in yt-looper"><span style="margin:0 0.1em;font-size:2.25em;vertical-align: middle;">&#x21BB;</span> yt.aergia.eu </button>').hide();
      var $intervals = $('<span id="yt-looper-interval"></span>').hide();
      var input = '<input class="yt-uix-form-input-text title-input" style="width:50px!important;margin-right:0.25em;" />';
      var $secondaryActions = $('div.watch-action-buttons > div.watch-secondary-actions');
      var start = humanize(0);
      var end = humanize(getYtPlayer().getDuration());
      var $start = $(input).attr('id', 'yt-looper-start').val(start).attr('title', 'Start of loop');
      var $end = $(input).attr('id', 'yt-looper-end').val(end).attr('title', 'End of loop');
      $secondaryActions.prepend($button);
      $intervals.append($start).append($end).insertBefore($button);
      $button.show();
      $button.click(function () {
        var url = window.location.href;
        url = url.replace(/.*youtube.com\/watch/, 'https://yt.aergia.eu/');
        if (getYtPlayer().getPlayerState() === 2) {
          url = url.replace(/[&#]t=[^&#]*/g, '');
          url = url + '#t=' + $('#yt-looper-start').val() + ';' + $('#yt-looper-end').val();
        }
        window.open(url);
      });
    };

    var initButton = function() {
      window.onYouTubePlayerReady = function () {
        console.log('yt-looper @ onYouTubePlayerReady');
        var newVideo = true;
        window.ytPlayerStateChanged = function (state) {
          if (state === 2) {
            $('#yt-looper-start').val(humanize(getYtPlayer().getCurrentTime()));
            $('#yt-looper-interval').fadeIn('slow');
          } else if (state === 1) {
            // youtube redraws div.watch-action-buttons AFTER 5 and -1 events
            // and 1 is the only one we have after GUI stabilizes
            // ANGST.
            newVideo = true;
          } else {
            $('#yt-looper-interval').hide();
            $('#yt-looper-start').val(humanize(0));
          }
          if (newVideo) {
            renderLooperActions();
            newVideo = false;
          }
        };
        renderLooperActions();
        getYtPlayer().addEventListener('onStateChange', 'ytPlayerStateChanged');
      };
    };
    initButton();
  };
  var imgurHandler = function () {
    var $oldButton = $('li#yt-looper');
    var imgurId = window.location.pathname.replace(/\/(?:[^\/]+\/)*/, '');
    var renderButton = function() {
      // display button only on single-image pages
      if (/[a-zA-Z0-9]+/.test(imgurId) && ($('div.post-image img').length === 1 || $('div.post-image video').length === 1)) {
        console.log('yt-looper @ imgurHandler('+imgurId+')');
        var containerId = $('div.post-image-container').attr('id');
        if (containerId && containerId !== imgurId) {
          // https://github.com/lidel/yt-looper/issues/155
          imgurId = containerId;
        }
        var url = 'https://yt.aergia.eu/#i=' + imgurId;
        var html = '<a style="min-width:28px;min-height:26px;padding:12px 6px;pointer:cursor"><span style="font-size:2em;vertical-align:middle;line-height:26px">&#x21BB;</span>&nbsp;yt.aergia.eu</a>';
        var $a = $(html).click(function () {
          window.open(url);
        });
        var $newButton = $('<li id="yt-looper">').append($a).data('imgurId', imgurId);
        $('#main-nav ul').append($newButton);

      }
    };
    if ($oldButton.length === 0 || $oldButton.data('imgurId') != imgurId) {
      $oldButton.remove();
      renderButton();
    }
  };
  var soundCloudHandler = function () {
    if ($('#yt-looper').length === 0) {
      var $soundActions = $('div.l-about-top div.soundActions');
      if ($soundActions.length === 1) {
        console.log('soundCloudHandler(): adding yt-looper button..');
        var scId = window.location.pathname.replace(/^\//, '');
        var url = 'https://yt.aergia.eu/#s=' + scId;
        var $button = $('<button id="yt-looper" class="sc-button sc-button-medium" title="Open in yt-looper"><span style="font-weight: 900;">&#x21BB;</span>&nbsp;yt.aergia.eu</button>');
        $button.click(function () {
          window.open(url);
        });
        $('div.sc-button-group', $soundActions).first().append($button);
      }
    }
  };
  switch (window.location.hostname.replace('www.', '')) {
    case 'youtube.com':
      youtubeHandler();
      break;
    case 'imgur.com':
      window.setInterval(imgurHandler, 1000); // quick hack for reactive gui
      break;
    case 'soundcloud.com':
      window.setInterval(soundCloudHandler, 1000); // same
      break;
  }
}(window.jQuery.noConflict(true)));
// vim:ts=2:sw=2:et:
