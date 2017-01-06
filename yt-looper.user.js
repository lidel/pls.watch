// ==UserScript==
// @name        yt-looper
// @description Adds a button on YouTube, Imgur and SoundCloud to open current resource in yt.aergia.eu looper
// @namespace   https://yt.aergia.eu
// @icon        https://i.imgur.com/EGgL1nx.png
// @include     https://www.youtube.com/*
// @include     https://youtube.com/*
// @include     http://www.youtube.com/*
// @include     http://youtube.com/*
// @include     https://imgur.com/*
// @include     http://imgur.com/*
// @include     http://soundcloud.com/*
// @include     https://soundcloud.com/*
// @version     1.7.5
// @downloadURL https://yt.aergia.eu/yt-looper.user.js
// @require     https://cdn.jsdelivr.net/jquery/3.1.1/jquery.min.js
// @grant       none
// @noframes
// ==/UserScript==
(function ($, undefined) { // eslint-disable-line no-unused-vars
  'use strict';
  var youtubeHandler = function () {
    var atWatchPage = window.location.pathname.startsWith('/watch');
    if (atWatchPage && $('#yt-looper').length === 0) {
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
      var playlistMode = function () {
        return /list=/.test(window.location.href);
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
        if (!playlistMode()) { // disable start/end picker when in playlist mode (did not work correct anyway)
          $intervals.append($start).append($end).insertBefore($button);
        }
        $button.show();
        $button.click(function () {
          var url = window.location.href;
          url = url.replace(/.*youtube.com\/watch\?/, 'https://yt.aergia.eu/#');
          if (playlistMode()) {
              url = url.replace(/[&#]t=[^&#]*/g, '');
          } else if (getYtPlayer().getPlayerState() === 2) {
              url = url.replace(/[&#]t=[^&#]*/g, '');
              url = url + '#t=' + $('#yt-looper-start').val() + ';' + $('#yt-looper-end').val();
          }
          window.open(url);
        });
      };

      var initButton = function() {
        var newVideo = true;
        window.ytLooperStateChanged = function (state) {
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
        getYtPlayer().addEventListener('onStateChange', 'ytLooperStateChanged');
      };

      initButton();
    }
  };
  var imgurHandlerRenderButton = function(ids) {
    var id = ids[0];
    if (/[a-zA-Z0-9]+/.test(id) && ($('div.post-image img').length > 0 || $('div.post-image video').length > 0)) {
      console.log('yt-looper → renderButton for ' + ids.join(', '));
      var url = 'https://yt.aergia.eu/#i=' + ids.join('&i=');
      var html = '<a style="pointer:cursor;text-decoration:none;color:#ccc" title="Open in yt.aergia.eu"><span style="font-size:1.5em">&#x21BB;</span><br>yt.looper</a>';
      var $a = $(html).click(function () {
        window.open(url);
      });
      $('<div class="post-account" id="yt-looper">')
        .data('imgurId', id)
        .css('margin-left','1em')
        .css('float', 'right')
        .css('text-align', 'center')
        .append($a)
        .hide()
        .prependTo($('div.post-header'))
        .fadeIn('slow');

    }
  };
  var imgurHandler = function () {
    var $oldButton = $('#yt-looper');
    var imgurIds = $('div.post-image-container').map(function() { return $(this).attr('id'); }).get();
    if (imgurIds.length > 0 && $oldButton.data('imgurId') != imgurIds[0]) {
      $oldButton.remove();
      imgurHandlerRenderButton(imgurIds);
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
  // since everyone does reactive gui, we just poll to see if elements are present/gone
  console.log('yt-looper userscript loaded');
  switch (window.location.hostname.replace('www.', '')) {
    case 'youtube.com':
      window.setInterval(youtubeHandler, 2000);
      break;
    case 'imgur.com':
      window.setInterval(imgurHandler, 1000);
      break;
    case 'soundcloud.com':
      window.setInterval(soundCloudHandler, 1000);
      break;
  }
}(window.jQuery.noConflict(true)));
// vim:ts=2:sw=2:et:
