function renderPage() {
  var v = urlParam('v');
  if (v) {
    // splash screen
    $('#box').css('background-image', 'url(//img.youtube.com/vi/' + v + '/hqdefault.jpg)');
    initYT(v);
  } else {
    $('#box').html(
          '<p><strong>Usage:</strong></p>'
        + '<p>Append <tt>#v=VIDEO_ID&t=start;end</tt> to URL.</p>'
        + '<p>Eg. <tt><a href="#v=ZuHZSbPJhaY&t=1h1s;1h4s">#v=ZuHZSbPJhaY&t=1h1s;1h4s</a></tt></p>'
    );
  }
}

function initYT(v) {

  var tag = document.createElement('script');
  tag.src = "//www.youtube.com/iframe_api";

  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

}

function onYouTubeIframeAPIReady() {

  // remove old player object
  var $player = $('#player');
  if ($player.length > 0) {
    $player.remove();
  }

  $('#box').html('<div id="player"></div>');

  var nextInterval = getNextInterval();

  new YT.Player('player', {
    width: '640',
    videoId: urlParam('v'),

    playerVars: {
      'start': getSecs(getStart(nextInterval)),
      'end': getSecs(getEnd(nextInterval)),
      'autohide': '1',
      'html5': '1',
      'iv_load_policy': '3',
      'modestbranding': '1',
      'showinfo': '0',
      'theme': 'dark',
    },

    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}


function onPlayerStateChange(event) {
  var player = event.target;

  // Loop on ENDED event or when end of full video is reached
  // Why? For some reason if no 'end' timestamp is provided,
  // YT api ends video with PAUSE instead of ENDED (sic!)
  if (event.data == YT.PlayerState.ENDED
      || (event.data == YT.PlayerState.PAUSED
          && player.getDuration() === player.getCurrentTime())) {

    if (getNextInterval.intervals.length > 1) {
      onYouTubeIframeAPIReady(); // restart player
    } else {
      player.seekTo(getSecs(getStart(urlParam('t'))));
      player.playVideo();
    }

  }
}

function onPlayerReady(event) {
  $(document).prop('title', event.target.getVideoData().title);
  $('#box').css('background-image', 'none');
  event.target.playVideo();
}

function urlParam(key) {
  var result = new RegExp(key + '=([^&]*)', 'i').exec(window.location.href);
  return result && unescape(result[1]) || '';
};

function getNextInterval() {
  if (getNextInterval.intervals == null) {
    getNextInterval.intervals = urlParam('t').split('+');
    getNextInterval.interval  = 0;
  }

  var thisInterval = getNextInterval.intervals[getNextInterval.interval++];

  if (getNextInterval.interval >= getNextInterval.intervals.length) {
    getNextInterval.interval = 0;
  }

  return thisInterval;
}

function getStart(t) {
  return !t ? 0 : t.split(';')[0];
}

function getEnd(t) {
  var t = !t ? null : t.split(';');
  if (t && t.length > 1) {
    return t[1];
  } else {
    return null;
  }
}

function getSecs(t) {

  // convert from 1h2m3s
  var tokens = /(\d+h)?(\d+m)?(\d+s)?/g.exec(t);
  //console.log(tokens);
  var tt = 0;
  $.each(tokens, function(i, token) {
    if (token && i > 0) {
      if (token.indexOf('s') != -1) {
        tt += parseInt(token.split('s')[0], 10);
      } else if (token.indexOf('m') != -1) {
        tt += 60 * parseInt(token.split('m')[0], 10);
      } else if (token.indexOf('h') != -1) {
        tt += 3600 * parseInt(token.split('h')[0], 10);
      }
    }
  });

  return tt > 0 ? tt : t;
}

$(window).bind('hashchange', function() {
  console.log('hash change: ' + window.location.hash);

  // reset player or entire page
  getNextInterval.intervals = null;
  if ($('#player').length > 0) {
    onYouTubeIframeAPIReady();
  } else {
    renderPage();
  }
});

// vim:ts=2:sw=2:et:
