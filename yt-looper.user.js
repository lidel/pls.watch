// ==UserScript==
// @name        yt-looper
// @description Adds a button on YouTube to open current video in yt.aergia.eu looper
// @namespace   http://yt.aergia.eu
// @icon        http://youtube.com/favicon.ico
// @include     http://www.youtube.com/watch*
// @include     http://youtube.com/watch*
// @include     https://www.youtube.com/watch*
// @include     https://youtube.com/watch*
// @version     1.1
// @updateURL   https://raw.github.com/lidel/yt-looper/master/yt-looper.user.js
// @downloadURL https://raw.github.com/lidel/yt-looper/master/yt-looper.user.js
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// ==/UserScript==

var ytLooperLoaded = false;

(function (undefined) {

  var humanize = function (sec) {
    var sec_num = parseInt(sec, 10);
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    hours   = hours   > 0 ? (hours   + 'h') : '';
    minutes = minutes > 0 ? (minutes + 'm') : '';
    seconds = seconds > 0 ? (seconds + 's') : '';

    return hours+minutes+seconds;
  };

  window.onYouTubePlayerReady = function() {

    if (!ytLooperLoaded) {
      var $secondaryActions = $('div.watch-secondary-actions');
      var $button = $('<button id="yt-looper" class="yt-uix-button yt-uix-button-opacity yt-uix-button-has-icon"><span style="margin:0 0.1em;font-size:2.25em;vertical-align: middle;">&#x21BB;</span> yt.aergia.eu </button>');

      var doc = window.document;
      var ytplayer = doc.getElementById('movie_player') || doc.getElementById('movie_player-flash');
      var start = humanize(ytplayer.getCurrentTime());
      var end = humanize(ytplayer.getDuration());

      var $intervals = $('<span id="yt-looper-interval"></span>');
      var input = '<input class="yt-uix-form-input-text title-input" style="width:50px!important;margin-right:0.25em;" />';
      var $start = $(input).attr('id','yt-looper-start').val(start).attr('title','Start of loop');
      var $end   = $(input).attr('id','yt-looper-end').val(end).attr('title','End of loop');

      $secondaryActions.prepend($button);
      $intervals.append($start).append($end).insertBefore($button);

      ytLooperLoaded = true;

      $button.click(function () {
        window.open(window.location.href.replace(/.*youtube.com\/watch/, 'https://yt.aergia.eu/')
                    + ':t=' + $('#yt-looper-start').val() + ';' + $('#yt-looper-end').val());
      });

      window.ytPlayerStateChanged = function (state) {
        if (state === 2) {
          $('#yt-looper-start').val(humanize(ytplayer.getCurrentTime()));
          $('#yt-looper-interval').fadeIn('slow');
          $button.attr('title','Click to loop selected fragment');
        } else {
          $('#yt-looper-interval').hide();
          $button.attr('title','Click to loop entire video (or pause to select fragment)');
        }
      };

      ytplayer.addEventListener ('onStateChange', 'ytPlayerStateChanged');

    }
  };

}());
// vim:ts=2:sw=2:et:
