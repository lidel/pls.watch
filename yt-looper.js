
// HALPERS
function logLady(a, b) { // KEKEKE
  console.log(!_.isString(a) ? JSON.stringify(a)
                             : b ? a +': '+ JSON.stringify(b)
                                 : a);
}


// ICONS
var faviconPlay  = 'data:image/vnd.microsoft.icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAABMLAAATCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgNkQkIDZGiCA2RzAgNkcwIDZH/CA2R/wgNkf8IDZH/CA2R/wgNkf8IDZH/CA2R2AgNkcwIDZHMCA2RhAgNkQYIDpWHCA6V/wgOlf8IDpX/CA6V/wgOlf8IDpX/CA6V/wgOlf8IDpX/CA6V/wgOlf8IDpX/CA6V/wgOlf8IDpWHCQ6ZzAkOmf8JDpn/CQ6Z/wkOmf8JDpb/BQhc/wgMgf8JDpn/CQ6Z/wkOmf8JDpn/CQ6Z/wkOmf8JDpn/CQ6ZzAkOnuoJDp7/CQ6e/wkOnv8JDp7/Exed/8jIy/9RU4j/Bwp0/wkOm/8JDp7/CQ6e/wkOnv8JDp7/CQ6e/wkOnuoJD6T8CQ+k/wkPpP8JD6T/CQ+k/xUbo//V1dX/1dXV/4yNrP8QFG//CA6Y/wkPpP8JD6T/CQ+k/wkPpP8JD6T8CQ+q/wkPqv8JD6r/CQ+q/wkPqv8WG6n/3d3d/93d3f/d3d3/v7/M/y0wjv8JD6r/CQ+q/wkPqv8JD6r/CQ+q/woQr/8KEK//ChCv/woQr/8KEK//Fx2v/+fn5//n5+f/5+fn/+jo6P+YmtP/ChCv/woQr/8KEK//ChCv/woQr/8KELX8ChC1/woQtf8KELX/ChC1/xgdtf/x8fH/8fHx//Ly8v+bndv/Ehi3/woQtf8KELX/ChC1/woQtf8KELX8ChG76goRu/8KEbv/ChG7/woRu/8YH77/+fn5/+/v9/9fY9H/ChG7/woRu/8KEbv/ChG7/woRu/8KEbv/ChG76goRwMwKEcD/ChHA/woRwP8KEcD/EBfB/6Ol5/8tM8n/ChHA/woRwP8KEcD/ChHA/woRwP8KEcD/ChHA/woRwMwLEcSHCxHE/wsRxP8LEcT/CxHE/wsRxP8LEcT/CxHE/wsRxP8LEcT/CxHE/wsRxP8LEcT/CxHE/wsRxP8LEcSHCxLICQsSyKULEsjMCxLI+QsSyP8LEsj/CxLI/wsSyP8LEsj/CxLI/wsSyP8LEsj/CxLI0gsSyMwLEsiiAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAP//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAD//wAA//8AAA==';
var faviconPause = 'data:image/vnd.microsoft.icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AAgNkQkIDZGiCA2RzAgNkcwIDZH/CA2R/wgNkf8IDZH/CA2R/wgNkf8IDZH/CA2R2AgNkcwIDZHMCA2RhAgNkQYIDpWHCA6V/wgOlf8IDpX/CA6V/wgOlf8IDpX/CA6V/wgOlf8IDpX/CA6V/wgOlf8IDpX/CA6V/wgOlf8IDpWHCQ6ZzAkOmf8JDpn/CA6V/wgOlf8IDpX/CA6V/wgOlf8IDpX/CA6V/wgOlf8JDpn/CQ6Z/wkOmf8JDpn/CQ6ZzAkOnuoJDp7/CQ6e/wgOlf8IDpX///////////8KEbv/CA6V////////////CQ6e/wkOnv8JDp7/CQ6e/wkOnuoJD6T8CQ+k/wkPpP8JD6T/CxHE////////////ChG7/wgOlf///////////woRu/8JD6T/CQ+k/wkPpP8JD6T8CQ+q/wkPqv8JD6r/CQ+q/wsRxP///////////woRu/8IDpX///////////8KEbv/CQ+q/wkPqv8JD6r/CQ+q/woQr/8KEK//ChCv/woQr/8LEcT///////////8KEbv/CxHE////////////ChG7/woQr/8KEK//ChCv/woQr/8KELX8ChC1/woQtf8KELX/CxHE////////////ChG7/wsRxP///////////woRu/8KELX/ChC1/woQtf8KELX8ChG76goRu/8KEbv/ChG7/wsRxP///////////woRu/8LEcT///////////8KEbv/ChG7/woRu/8KEbv/ChG76goRwMwKEcD/ChHA/woRwP8LEcT///////////8KEbv/CxHE////////////ChHA/woRwP8KEcD/ChHA/woRwMwLEcSHCxHE/wsRxP8LEcT/CxHE/wsRxP8LEcT/CxHE/wsRxP8LEcT/CxHE/wsRxP8LEcT/CxHE/wsRxP8LEcSHCxLICQsSyKULEsjMCxLI+QsSyP8LEsj/CxLI/wsSyP8LEsj/CxLI/wsSyP8LEsj/CxLI0gsSyMwLEsiiAAAAAP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A//8AAP//AACAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIABAAD//wAA//8AAA==';
var faviconWait  = 'data:image/vnd.microsoft.icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgNkQkIDZGiCA2RzAgNkcwIDZH/CA2R/wgNkf8IDZH/CA2R/wgNkf8IDZH/CA2R2AgNkcwIDZHMCA2RhAgNkQYIDpWHCA6V/wgOlf8IDpX/CA6V/wgOlf8IDpX/CA6V/wgNk/8IDZT/CA6V/ggOlfwIDpX/CA6V/wgOlf8IDpWHCQ6ZzAkOmf8JDpn/CA6X/wgOl/8IDpX/CA6V/wgOlf8IDpX/CA6V/wkOmP8JDpn/CQ6Z/wkOmf8JDpn/CQ6ZzAkOnuoJDp7/CQ6e/wkOm/8JDpv/DBGY/wsRmP8JDpn/CA2Z/wkOmf8JDpv/CQ6d/wkOnv8JDp7/CQ6e/wkOnuoJD6T8CQ+k/wkPpP8JDqH/CQ6f/wsQnf8JDpz/CQ6d/wkOn/8JDp7/CA6e/wkOoP8JD6L/CQ+k/wkPpP8JD6T8CQ+q/wkPqv8JD6n///////////8JDqH+CQ6i/v//////////CQ+j/gkPov///////////wkPqv8JD6r/CQ+q/woQr/8KEK//ChCv////////////ChCn/woQpv///////////wkPqf8JD6r///////////8KEK//ChCv/woQr/8KELX8ChC1/woQtP8KELL/ChCw/wkPrf8JD6z/CQ+t/goQrv4KEK/+ChCv/goQsf4KELX/ChC1/woQtf8KELX8ChG76goRu/8KEbv/ChC4/woQtf8KELP/ChCx/woQsv8KELT+ChC1/woQtf4KELf+ChG7/woRu/8KEbv/ChG76goRwNgKEcD4ChHA+woRvv0KELz+CxG5/goQuP4MErf+ChG6/goRu/4KEbv+ChG//woRwP8KEcD/ChHA/woRwMwLEcSHCxHE/wsRxP8LEcT+ChHB/wsSvv8MEr//ChG+/woRwP8LEcT/ChHD/woRw/8LEcT/CxHE/wsRxP8LEcSHCxLICQsSyKULEsjMCxLI+QsSyP8LEsj/CxLI/woRxf8LEsj/CxLI/wsSyP8LEsj/CxLI0gsSyMwLEsiiAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAP//AACAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIABAAD//wAA//8AAA==';


// PROTOTYPES (fufuf jshitn!)
var Player, YouTubePlayer, ImgurPlayer;


// ENUMS
var YT_PLAYER_SIZES = { // size reference: http://goo.gl/45VxXT
                        small:   {width:  320,  height:  240},
                        medium:  {width:  640,  height:  360},
                        large:   {width:  853,  height:  480},
                        hd720:   {width: 1280,  height:  720},
                        hd1080:  {width: 1920,  height: 1080}
                      };

var PLAYER_TYPES = { v: {urlKey: 'v', name: 'youtube', player: YouTubePlayer},
                     i: {urlKey: 'i', name: 'imgur'  , player:   ImgurPlayer} };

var PLAYER_TYPES_REGX = '['+ _(PLAYER_TYPES).keys().join('') +']'; // nice halper


// document.head (http://jsperf.com/document-head) failsafe init for old browsers
document.head = typeof document.head != 'object'
              ? document.getElementsByTagName('head')[0]
              : document.head;


function showShortUrl() {
  $.ajax({
    url: 'https://www.googleapis.com/urlshortener/v1/url',
    type: 'POST',
    contentType: 'application/json; charset=utf-8',
    data: '{ longUrl: "'+ window.location.href +'" }',
    dataType: 'json',
    success: function(data) {
      logLady('data', data);

      $('#shorten').hide();

      var input = '<input type="text" value="'+ data.id +'" readonly>';
      var     a = '<a href="'+ data.id +'" target="_blank" title="click to test short url in a new tab">&#10548;</a>';
      var  span = '<span id="shortened">ctrl+c to copy '+ input + a +'</span>';

      $('#menu').append(span);

      var $input = $('#shortened>input');
      $input.width(Math.ceil($input.val().length/1.9) + 'em');
      $input.select();
      $input.click(function(){ $input.select(); });
    }
  });
}


function changeFavicon(src) {
  var oldIcon = document.getElementById('dynamic-favicon');
  if (oldIcon || (!src && oldIcon)) {
    document.head.removeChild(oldIcon);
  }
  if (src) {
    var icon = document.createElement('link');
    icon.id = 'dynamic-favicon';
    icon.rel = 'shortcut icon';
    icon.href = src;
    document.head.appendChild(icon);
  }
}


function getPlayerSize() {
  var $box      = $('#box');
  var cookie    = $.cookie('responsive');
  var docWidth  = $(document).width()  * 0.8; // UX hack
  var docHeight = $(document).height() * 0.8;
  var playerSize  = YT_PLAYER_SIZES.medium; // default when responsive scaling is disabled

  if (cookie !== undefined) {
    playerSize  = YT_PLAYER_SIZES.small;

    $.when($.each(YT_PLAYER_SIZES, function(k, v) {
      if (v.width > playerSize.width && v.width < docWidth && v.height < docHeight) {
        playerSize = YT_PLAYER_SIZES[k];
      }
    })).done(function() {
      logLady('Calculated player size', playerSize);

      // fix undesired padding in some browsers
      $box.css('max-width',  playerSize.width);
      $box.css('max-height', playerSize.height);
    });
  }

  return playerSize;
}


function getParam(params, key) {
  var rslt = new RegExp(key + '=([^&]*)', 'i').exec(params);
  return rslt && _.unescape(rslt[1]) || '';
}


function getVideo(params) {
  var rslt = new RegExp('('+ PLAYER_TYPES_REGX +')=([^&]*)', 'i').exec(params);
  return rslt ? { urlKey: rslt[1], videoId: _.unescape(rslt[2]) }
              : { urlKey:    null, videoId:                  '' };
}


function urlParam(key) {
  return getParam(window.location.href, key);
}


function urlFlag(key) {
  var ptrn = '(?:[#]' + key + '[&])|(?:[&]' + key + '$)';
  var rslt = new RegExp(ptrn).exec(window.location.href);
  return !rslt ? urlParam(key) == 'true' : true;
}


function parseVideos(url) {
  var ptrn = PLAYER_TYPES_REGX + '=[^&]*(?:[&]t=[^&]*)?';
  var regx = new RegExp(ptrn, 'g'), rslt;
  var vids = [];
  while ((rslt = regx.exec(url))) vids.push(rslt[0]);
  return vids;
}


function parseIntervals(v) {
  var getSeconds = function(t) {
    var tokens = /(\d+h)?(\d+m)?(\d+s)?/.exec(t); // converting from 1h2m3s
    var tt = 0;
    _(tokens).each(function(token, i) {
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
    return tt > 0 ? tt : parseInt(t, 10);
  };
  var t;
  return v && (t = getParam(v, 't')) && t.length
    ? _(t.split('+')).map(function(interval) {
        var tt = interval.split(';');
        return { start: getSeconds(tt[0]),
                   end: tt.length > 1 ? getSeconds(tt[1]) : null };
      })
    : [];
}


function normalizeUrl(href) {
  var url    = href || window.location.href;
  var apiUrl = url;

  // force hash-based URLs and translate YouTube URL shenanigans
  apiUrl = apiUrl.replace(/[?#]|%23/g,'&').replace(/[&]/,'#');
  apiUrl = apiUrl.replace('/watch','');

  // [:] shall be speshul
  apiUrl = apiUrl.replace(/:([vit])=/g,'&$1=');
  apiUrl = apiUrl.replace(':shuffle','#shuffle');

  if (!href && url != apiUrl) document.location.replace(apiUrl);

  return apiUrl;
}


function showShuffleUi(multivideo) {
  var $shuffleUi = $('#shuffle-ui').hide();
  if (multivideo) {
    var shuffleFlag = urlFlag('shuffle');
    var toggleUrl   = document.location.href.replace(/shuffle[^&]*&|&shuffle[^&]*$/g, '');
    var $shuffle    = $('#shuffle', $shuffleUi);

    if (shuffleFlag) {
      $shuffle.addClass('ticker');
    } else {
      $shuffle.removeClass('ticker');
      toggleUrl = toggleUrl + '&shuffle';
    }

    $shuffle.unbind('click').click(function() {
      document.location.replace(toggleUrl);
    });

    $shuffleUi.show();
  }
}


function jackiechanMyIntervals(href, shuffle) { // such name
  var extendIntervals = function(videos) {
    var r = // stuped halper
      _(videos).map(function(video) {
        var ys = parseIntervals(video);
        return ys.length
          ? _(ys).map(function(y) {
              return _.extend(getVideo(video), y);
            })
          : [ _.extend(getVideo(video), { start: 0,
                                            end: null }) ];
      });
    return r;
  };
  var computeDirections = function(xs) {
    var zs = {}; // index map 2d -> 1d
    var Y = ','; // such shape
    var k = 0;
    _(xs).each(function(ys, i) {
      _(ys).each(function(y, j) {
        zs[i+Y+j] = k++;
        _.extend(y, { // y is not a copy!
          nextI: j < ys.length-1 ?             i+Y+(j+1)         :     i+Y+0,
          prevI: j === 0         ?             i+Y+(ys.length-1) :     i+Y+(j-1),
          nextV: i < xs.length-1 ?         (i+1)+Y+0             :     0+Y+0,
          prevV: i === 0         ? (xs.length-1)+Y+0             : (i-1)+Y+0,
        });
      });
    });
    var r = // stuped halper
      _(xs).chain().flatten(true).map(function(y) {
        y.nextI = zs[y.nextI]; // map
        y.prevI = zs[y.prevI]; //     to
        y.nextV = zs[y.nextV]; //        flat
        y.prevV = zs[y.prevV]; //             list
        return y;
      }).value();
    return r;
  };
  var vs = shuffle ? _.shuffle(parseVideos(href))
                   :           parseVideos(href);
  return {
    multivideo: vs.length > 1,
     intervals: computeDirections(extendIntervals(vs))
  };
}


function Playlist(href) {
  logLady('Playlist()');

  _.extend(Playlist, jackiechanMyIntervals(href, urlFlag('shuffle')));
  Playlist.index = 0;

  Playlist.log = function() {
    _(Playlist.intervals).each(logLady);
  };

  Playlist.current = function() {
    return Playlist.intervals[Playlist.index];
  };

  Playlist.go = function(direction) { // 'nextI' 'prevI' 'nextV' 'prevV'
    return Playlist.intervals[Playlist.index = Playlist.current()[direction]];
  };

  Playlist.cycle = function() {
    return Playlist.index >= Playlist.current().nextI ? Playlist.go('nextV')
                                                      : Playlist.go('nextI');
  };
}


function YouTubePlayer() {
  logLady('YouTubePlayer()');

  YouTubePlayer.newPlayer = function(playback) {
    var size = getPlayerSize();

    var player = new YT.Player('player',{
      height: size.height,
      width:  size.width,
      videoId: playback.videoId,
      playerVars: {
        start: playback.start,
        end: playback.end,
        autohide: '1',
        html5: '1',
        iv_load_policy: '3',
        modestbranding: '1',
        showinfo: '0',
        rel: '0',
        theme: 'dark',
      },
      events: {
        onReady: onYouTubePlayerReady,
        onStateChange: onYouTubePlayerStateChange
      }
    });

    Player.autosize = function() {
      var size = getPlayerSize();
      $('#player').animate(_.pick(size, 'height', 'width'), 400)
        .promise().done(function() {
          // just to be sure player noticed resize..
          player.setSize(size.width, size.height);
        });
    };
  };

  var onYouTubePlayerReady = function(event) {
    logLady('onYouTubePlayerReady()');

    $(document).prop('title', event.target.getVideoData().title);
    $('#box').css('background-image', 'none');

    event.target.playVideo();
  };

  var onYouTubePlayerStateChange = function(event) {
    logLady('onYouTubePlayerStateChange()', event.data);

    if (event.data == YT.PlayerState.ENDED) {
      changeFavicon(faviconWait);

      if (Playlist.multivideo) {
        Player.newPlayer(Playlist.cycle());
      } else {
        event.target.seekTo(Playlist.current().start);
        event.target.playVideo();
      }

    } else if (event.data == YT.PlayerState.PLAYING) {
      changeFavicon(faviconPlay);
    } else if (event.data == YT.PlayerState.PAUSED) {
      changeFavicon(faviconPause);
    } else {
      changeFavicon(faviconWait);
    }
  };
}


function ImgurPlayer() {
  logLady('ImgurPlayer()');
  
  var imgurHome = 'http://i.imgur.com';
  var timerId;

  ImgurPlayer.newPlayer = function(playback) {
    var imgUrl = imgurHome +'/'+ playback.videoId;
    var size   = getPlayerSize();

    var $player = $('#player');
    $player.height(size.height);
    $player.width(size.width);
    $player.css('background', 'url("'+ imgUrl +'") no-repeat center');
    $player.css('background-size', 'contain'); // browser compatibility warning!

    Player.autosize = function() {
      $player.animate(_.pick(getPlayerSize(), 'height', 'width'), 400);
    };

    if (Playlist.multivideo) {
      // no need to worry about potentially badly defined value of timerId, because:
      // 1. we are single threaded
      // 2. callbacks do not interrupt anything
      $player.on('destroyed', onImgurPlayerRemove);
      timerId = _.delay(onImgurPlayerStateChange, 1000*(playback.start || 3)); // milis
    }
  };

  var onImgurPlayerStateChange = function() {
    Player.newPlayer(Playlist.cycle());
  };

  var onImgurPlayerRemove = function() {
    clearTimeout(timerId);
  };
}


function Player() {
  logLady('Player()');

  Player.newPlayer = function(playback) {
    logLady('Player.newPlayer()', playback);

    var $player = $('#player');
    if ($player.length) {
      $player.remove();
    }

    $('#box').html('<div id="player"></div>');

    // prevalidated! no need to check ^e_
    PLAYER_TYPES[playback.urlKey].player.newPlayer(playback);
  };

  Playlist(window.location.href);
  Playlist.log();

  YouTubePlayer();
  ImgurPlayer();

  Player.newPlayer(Playlist.current());
  showShuffleUi(Playlist.multivideo);
}


function onYouTubeIframeAPIReady() {
  logLady('onYouTubeIframeAPIReady()');
  Player();
}


function initYT() {
  var tag = document.createElement('script');
  tag.src = '//www.youtube.com/iframe_api';
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}


function renderPage() {
  var video = getVideo(window.location.href);
  if (video.urlKey == 'v') {
    // splash screen
    $('#box').css('background-image', 'url(//img.youtube.com/vi/' + video.videoId + '/hqdefault.jpg)');
    initYT();
  } else if (video.urlKey == 'i') {
    initYT();
  } else {
    changeFavicon();
    $('#box').html(
          '<p><big>Usage:</big></p>'
        + '<p>append <tt>#v=VIDEO_ID&t=start;end</tt> to current URL<br/>'
        + 'alternative syntax: <tt>?v=VIDEO_ID&t=start;end</tt> or <tt>?v=VIDEO_ID:t=start;end</tt></p>'
        + '<p style="font-size:small">eg. <tt><a href="#v=ZuHZSbPJhaY&t=1h1s;1h4s">#v=ZuHZSbPJhaY&t=1h1s;1h4s</a></tt> '
        + 'or <tt><a href="#v=eSMeUPFjQHc&t=60;80&v=ZuHZSbPJhaY&t=1h;1h5s">#v=eSMeUPFjQHc&t=60;80&v=ZuHZSbPJhaY&t=1h;1h5s</a></tt><br/>'
        + 'or even <tt><a href="#v=ZNno63ZO2Lw&t=54s;1m20s+1m33s;1m47s+3m30s;3m46s&v=TM1Jy3qPSCQ&t=2s;16s">&v=ZNno63ZO2Lw&t=54s;1m20s+1m33s;1m47s+3m30s;3m46s&v=TM1Jy3qPSCQ&t=2s;16s</a></tt></p>'
        + '<p style="text-align:right;font-size:xx-small">More at <a href="https://github.com/lidel/yt-looper">GitHub</a></p>'
    );
  }
}


function responsivePlayerSetup() {
  var cookieKey     = 'responsive';
  var cookie        = $.cookie(cookieKey);
  var cookieOptions = { expires: 365, path: '/', secure: false };
  var $responsive   = $('#responsive');

  if (cookie === undefined) {
    $.cookie(cookieKey, true, cookieOptions);
    $responsive.addClass('ticker');
  } else {
    $.removeCookie(cookieKey, cookieOptions);
    $responsive.removeClass('ticker');
  }

  Player.autosize();
}


// various init tasks on page load
(function($) {
  $(window).bind('hashchange', function() {
    logLady('hash change: ' + window.location.hash);

    normalizeUrl();

    // reset things that depend on URL
    $('#shortened').remove();
    $('#shorten').show();

    // reset player or entire page
    if ($('#player').length > 0) {
      onYouTubeIframeAPIReady();
    } else {
      renderPage();
    }
  });


  // menu items will now commence!

  // SHORTEN
  $('#shorten').click(_.debounce(showShortUrl, 1000, true));

  // AUTOSIZE
  var $responsive = $('#responsive');
  $responsive.click(responsivePlayerSetup);
  // display current autosize setting in menu
  if ($.cookie('responsive')) { $responsive.addClass('ticker');    }
  else                        { $responsive.removeClass('ticker'); }
  // update player on window resize if autosize is enabled
  $(window).on('resize', _.debounce(function() {
    if ($.cookie('responsive')) {
      Player.autosize();
    }
  }, 300));


  // keyboard shortcuts will now commence!
  $(document).unbind('keypress').keypress(function(e) {
    var k = String.fromCharCode(e.which);
    if (k=='s') {
      var $shorten = $('#shorten');
      if ($shorten.is(':visible')) {
        $shorten.click();
      }
    } else {
      var current = 
        k=='h' ? Playlist.go('prevV')
               : k=='j' ? Playlist.go('prevI')
                        : k=='k' ? Playlist.go('nextI')
                                 : k=='l' ? Playlist.go('nextV')
                                          : null;
      if (current) Player.newPlayer(current);
    }
  });


  // enable dom element removal notification (because of reasons sic)
  $.event.special.destroyed = { remove: function(o){ if (o.handler) {o.handler();} } };

}(jQuery));

// vim:ts=2:sw=2:et:
