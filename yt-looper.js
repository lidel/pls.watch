

function getParam(params, key) {
  var rslt = new RegExp(key + '=([^&]*)', 'i').exec(params);
  return rslt && unescape(rslt[1]) || '';
}


function urlParam(key) {
  return getParam(window.location.href, key);
}


function parseVideos() {
  var rslt = /[#?]v=(.*)/i.exec(window.location.href);
  if (!rslt) {
    return [''];
  } else {
    var vids = (rslt[1] || '').split(/[#?&]v=/i);
    $.each(vids, function(i, vid) {
      vids[i] = 'v=' + vid;
    });
    return vids;
  }
}


function parseIntervals(v) {
  var getSeconds = function(t) {
    // convert from 1h2m3s
    var tokens = /(\d+h)?(\d+m)?(\d+s)?/g.exec(t);
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
  };
  var ret = [];
  if (v) {
    var t = getParam(v, 't');
    if (t && t.length) {
      $.each(t.split('+'), function(i, interval) {
        var tt = interval.split(';');
        var rec = { start: getSeconds(tt[0]),
                      end: null };
        if (tt.length > 1) {
          rec['end'] = getSeconds(tt[1]);
        }
        ret.push(rec);
      });
    }
  }
  return ret;
}


function playbackSchedule() {
  console.log('playbackSchedule()');

  playbackSchedule.schedule = [];
  playbackSchedule.index = 0;

  $.each(parseVideos(), function(i, video) {
    var v = getParam(video, 'v');
    var intervals = parseIntervals(video);

    if (intervals.length) {
      $.each(intervals, function(j, interval) {
        playbackSchedule.schedule.push(
          $.extend({ 'videoId': v }, interval)
        );
      });
    } else {
      playbackSchedule.schedule.push(
        { 'videoId': v,
            'start': 0,
             'end' : null }
      );
    }
  });

  playbackSchedule.log = function() {
    $.each(playbackSchedule.schedule, function(i, playback) {
      console.log(playback);
    });
  };

  playbackSchedule.current = function() {
    return playbackSchedule.schedule[playbackSchedule.index];
  };

  playbackSchedule.cycle = function() {
    var current = playbackSchedule.current();

    var index = playbackSchedule.index + 1;
    playbackSchedule.index = index >= playbackSchedule.schedule.length
                           ? 0
                           : index;
    return current;
  };
}


function onYouTubeIframeAPIReady() {
  console.log('onYouTubeIframeAPIReady()');

  var newPlayer = function(playback) {
    console.log('newPlayer()');
    console.log(playback);

    var $player = $('#player');
    if ($player.length) {
      $player.remove();
    }

    $('#box').html('<div id="player"></div>');

    new YT.Player('player',{
      width: '640',
      videoId: playback['videoId'],
      playerVars: {
        start: playback['start'],
        end: playback['end'],
        autohide: '1',
        html5: '1',
        iv_load_policy: '3',
        modestbranding: '1',
        showinfo: '0',
        rel: '0',
        theme: 'dark',
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange
      }
    });
  };

  var onPlayerReady = function(event) {
    console.log('onPlayerReady()');

    $(document).prop('title', event.target.getVideoData().title);
    $('#box').css('background-image', 'none');

    event.target.playVideo();
  };

  var onPlayerStateChange = function(event) {
    console.log('onPlayerStateChange(): ' + event.data);

    var player = event.target;

    if (event.data == YT.PlayerState.ENDED) {

      if (playbackSchedule.schedule.length > 1) {
        newPlayer(playbackSchedule.cycle());
      } else {
        player.seekTo(playbackSchedule.current()['start']);
        player.playVideo();
      }

    }
  };

  playbackSchedule();
  playbackSchedule.log();
  newPlayer(playbackSchedule.cycle());
}


function initYT(v) {
  var tag = document.createElement('script');
  tag.src = "//www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}


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


$(window).bind('hashchange', function() {
  console.log('hash change: ' + window.location.hash);

  // reset player or entire page
  if ($('#player').length > 0) {
    onYouTubeIframeAPIReady();
  } else {
    renderPage();
  }

});


// vim:ts=2:sw=2:et:
