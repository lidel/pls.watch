
// HALPERS
function logLady(a, b) { // kek
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
var YT_PLAYER_SIZES = Object.freeze({ // size reference: http://goo.gl/45VxXT
                        small:   {width:  320,  height:  240},
                        medium:  {width:  640,  height:  360},
                        large:   {width:  853,  height:  480},
                        hd720:   {width: 1280,  height:  720},
                        hd1080:  {width: 1920,  height: 1080}
                      });

var PLAYER_TYPES = Object.freeze({
                     v: {urlKey: 'v', name: 'youtube', engine: YouTubePlayer},
                     i: {urlKey: 'i', name: 'imgur'  , engine:   ImgurPlayer}
                   });

var PLAYER_TYPES_REGX = '['+ _(PLAYER_TYPES).keys().join('') +']'; // nice halper

// This API key works only with yt.aergia.eu domain
// Key for different referer can be generated at https://console.developers.google.com
var GOOGLE_API_KEY = 'AIzaSyDp31p-15b8Ep-Bfnjbq1EeyN1n6lRtdmU';

// document.head (http://jsperf.com/document-head) failsafe init for old browsers
document.head = typeof document.head != 'object'
              ? document.getElementsByTagName('head')[0]
              : document.head;


function showShortUrl() {
  var request = $.ajax({
    url: 'https://www.googleapis.com/urlshortener/v1/url?key=' + GOOGLE_API_KEY,
    type: 'POST',
    contentType: 'application/json; charset=utf-8',
    data: '{ longUrl: "'+ window.location.href +'" }',
    dataType: 'json',
  });
  request.done(function(data) {
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
  });
  request.fail(function(jqxhr, textStatus) {
    logLady('Unable to get short URL ('+ textStatus +'): ', jqxhr);

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
  var cookie    = $.cookie('no_autosize');
  var docWidth  = $(document).width()  * 0.8; // UX hack
  var docHeight = $(document).height() * 0.8;
  var playerSize  = YT_PLAYER_SIZES.medium; // default when responsive scaling is disabled

  if (cookie === undefined) {
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
  var rslt = new RegExp(key + '=([^&]+)', 'i').exec(params);
  return rslt && _.unescape(rslt[1]) || '';
}


function getVideo(params) {
  var rslt = new RegExp('('+ PLAYER_TYPES_REGX +')=([^&]+)', 'i').exec(params);
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

// Fix for problem #2 described in:
// https://github.com/lidel/yt-looper/issues/68#issuecomment-87316655
function deduplicateYTPlaylist(urlMatch, videoId, playlistId, index) {
  var apiRequest = 'https://www.googleapis.com/youtube/v3/playlistItems'
                  + '?part=snippet&playlistId=' + playlistId
                  + '&videoId=' + videoId
                  + '&maxResults=50'
                  + '&fields=items(kind%2Csnippet(position%2CresourceId))%2CnextPageToken'
                  + '&key=' + GOOGLE_API_KEY;
  var normalizedUrl = urlMatch;
  var retries = 3;
  $.ajax({ url: apiRequest, async: false}).done(function(data) {
    var item = data.items[0];
    // if position does match, remove duplicate from URL
    if (item.kind === 'youtube#playlistItem' && item.snippet.position == parseInt(index,10)-1) {
      normalizedUrl = normalizedUrl.replace(/([#&])(v=[^&]+&)(list=[^&]+&index=[^&]+)/, '$1$3');
    }
  }).fail(function(jqxhr, textStatus) {
    if (jqxhr.status === 404) {
      // videoId is not a member of playlistId
      // no need to change URL
    } else {
      logLady('Unable to get YouTube playlistId='+playlistId+' ('+ textStatus +'): ', jqxhr);
      retries = retries - 1;
    }
  });

  return normalizedUrl;
}

// Fix for problem #1 described in:
// https://github.com/lidel/yt-looper/issues/68#issuecomment-87316655
function recalculateYTPlaylistIndex(urlMatch, oldPlaylist, index) {
  var videosBefore = oldPlaylist.match(/[#&]v=/g);
  if (videosBefore) {
    return urlMatch.replace(/&index=\d+/, '&index='+(videosBefore.length+parseInt(index,10)));
  } else {
    return urlMatch;
  }
}

function inlineYTPlaylist(urlMatch, playlistId) {
  var apiRequest = 'https://www.googleapis.com/youtube/v3/playlistItems'
                  + '?part=snippet&playlistId=' + playlistId
                  + '&maxResults=50'
                  + '&fields=items(kind%2Csnippet(position%2CresourceId))%2CnextPageToken'
                  + '&key=' + GOOGLE_API_KEY;

  // hack to provide static API response then run in Travis CI
  var playlist = urlMatch.hasOwnProperty('testData') ? urlMatch.testData : {};
  var pageToken = null;
  var retries = 3;
  var inlinedPlaylist = '';

  if (!Object.keys(playlist).length) { // hit API only if there is no 'testData'
    /*jshint -W083*/
    while (retries>0 && (pageToken || !Object.keys(playlist).length)) {
      pageToken = (pageToken ? '&pageToken=' + pageToken : '');
      $.ajax({ url: apiRequest+pageToken, async: false}).done(function(data) {
        for (var i=0;i<data.items.length;i++) {
          var item = data.items[i];
          if (item.kind === 'youtube#playlistItem' && item.snippet.resourceId.kind === 'youtube#video') {
            playlist[item.snippet.position] = item.snippet.resourceId.videoId;
          }
        }
        pageToken = data.nextPageToken;
        retries = 3;
      }).fail(function(jqxhr, textStatus) {
        logLady('Unable to get YouTube playlistId='+playlistId+' ('+ textStatus +'): ', jqxhr);
        retries = retries - 1;
      });
    }
    /*jshint +W083*/
  }

  var keys = [];
  for (var position in playlist) {
    if (playlist.hasOwnProperty(position)) {
      keys.push(parseInt(position,10));
    }
  }
  keys.sort(function(a,b){return a-b;}); // I know, right?

  for (var i=0; i<keys.length;i++) {
    if (inlinedPlaylist.length) {
      inlinedPlaylist += '&';
    }
    inlinedPlaylist += 'v=' + playlist[keys[i]];
  }

  return inlinedPlaylist;
}


function normalizeUrl(href) {
  var url    = href || window.location.href;
  var apiUrl = url;

  // fix URLs butchered by IM clients
  apiUrl = decodeURIComponent(apiUrl);

  // translate YouTube URL shenanigans (yes, this is redundant, but was broken in past..)
  apiUrl = apiUrl.replace('#t=','&t=');
  apiUrl = apiUrl.replace('/watch','/');
  apiUrl = apiUrl.replace(/feature=[^&#]+[&#]/,'');

  // support legacy URLs
  apiUrl = apiUrl.replace(/[?#]|%23/g,'&').replace(/[&]/,'#');
  apiUrl = apiUrl.replace(/:([vit])=/g,'&$1=');
  apiUrl = apiUrl.replace(/[:&](shuffle|random)/,'&random');

  // inline items from YouTuble playlist
  apiUrl = apiUrl.replace(/[#&]v=([^&]+)&list=([^&]+)&index=([^&]+)/g, deduplicateYTPlaylist);
  apiUrl = apiUrl.replace(/(#.+&|#)list=[^&]+&index=(\d+)/, recalculateYTPlaylistIndex);
  apiUrl = apiUrl.replace(/list=([^&:#]+)/, inlineYTPlaylist);

  if (!href && url != apiUrl) document.location.replace(apiUrl);

  return apiUrl;
}


function showHelpUi(show) {
  var $help = $('#help');
  var $helpUi = $('#help-ui');
  var $helpToggle = $('#help-toggle', $helpUi);
  if (show && !$help.is(':visible')) {
    $helpToggle.addClass('ticker');
    $help.slideDown();
  } else if (!show && $help.is(':visible')) {
    $helpToggle.removeClass('ticker');
    $help.slideUp();
  }
}

function showRandomUi(multivideo) {
  var $randomUi = $('#random-ui').hide();
  if (multivideo) {
    var randomFlag = urlFlag('random');
    var toggleUrl   = document.location.href.replace(/random[^&]*&|&random[^&]*$/g, '');
    var $random    = $('#random', $randomUi);

    if (randomFlag) {
      $random.addClass('ticker');
    } else {
      $random.removeClass('ticker');
      toggleUrl = toggleUrl + '&random';
    }

    $random.unbind('click').click(function() {
      document.location.replace(toggleUrl);
    });

    $randomUi.show();
  }
}


function jackiechanMyIntervals(href) { // kek
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
  var intervals = computeDirections(extendIntervals(parseVideos(href)));
  return {
    multivideo: intervals.length > 1,
     intervals: intervals
  };
}


function Playlist(href) {
  logLady('Playlist()');

  _.extend(Playlist, jackiechanMyIntervals(href));

  // &index=<n>
  var index = getParam(href, 'index');
  if (index) {
    index = parseInt(index,10)-1;
    // bound gently
    if (index < 0) {
      index = 0;
    } else if (index >= Playlist.intervals.length) {
      index = Playlist.intervals.length-1;
    }
  } else {
    index = 0;
  }
  Playlist.index = index;

  Playlist.log = function() {
    _(Playlist.intervals).each(logLady);
  };

  Playlist.current = function() {
    return Playlist.intervals[Playlist.index];
  };

  Playlist.go = function(direction) { // 'nextI' 'prevI' 'nextV' 'prevV'
    if (urlFlag('random')) {
      return Playlist.random();
    }
    return Playlist.intervals[Playlist.index = Playlist.current()[direction]];
  };

  Playlist.jumpTo = function(index) {
    return Playlist.intervals[Playlist.index = index];
  };

  Playlist.cycle = function() {
    return Playlist.index >= Playlist.current().nextI ? Playlist.go('nextV')
                                                      : Playlist.go('nextI');
  };

  Playlist.random = function() {
    var list = Playlist.intervals;
    var current = Playlist.index;
    var random = current;
    // normalized random: ignore current one
    while (list.length > 1 && random === current) {
      random = Math.floor(Math.random()*list.length);
    }
    return Playlist.jumpTo(random);
  };
}


function YouTubePlayer() {
  logLady('YouTubePlayer()');

  YouTubePlayer.newPlayer = function(playback) {
    var size = getPlayerSize();

    YouTubePlayer.instance = new YT.Player('player',{
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
          YouTubePlayer.instance.setSize(size.width, size.height);
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

  var imgurHome = '//i.imgur.com';
  var timerId;

  ImgurPlayer.newPlayer = function(playback) {
    var imgUrl  = imgurHome +'/'+ playback.videoId;
    var $box    = $('#box');
    var $player = $('div#player');

    var getImagePlayerSize = function(image) {
      var pSize = _.extend({}, getPlayerSize());
      var iSize = {width: image.naturalWidth, height: image.naturalHeight}; // fcuk IE8
      pSize.width = iSize.width * (pSize.height / iSize.height);
      return pSize;
    };

    $(document).prop('title', playback.videoId);

    // smart splash screen
    changeFavicon(faviconWait);
    $player.html('<div class="spinner"></div>');
    if (imgUrl.indexOf('imgur.com') > -1) {
      // imgur provides thumbs, which enables us to set splash screen
      // and resize player to proper ratio
      var thumbUrl = imgUrl.replace(/^(.*)\.(png|gif|jpe?g)$/i, '$1m.$2');
      $('<img/>')
        .attr('src', thumbUrl)
        .load(function() {
          var size = getImagePlayerSize(this);
          $box.css('background-image', 'url(' + thumbUrl + ')');
          $player.height(size.height);
          $player.width(size.width);
        });
    } else {
      // fallback for future support of 'non-imgur' images
      var size = getPlayerSize();
      $player.height(size.height);
      $player.width(size.width);
    }

    $('<img/>')
      .attr('src', imgUrl)
      .load(function() {
        changeFavicon(faviconPlay);
        $player.empty();
        var image = this;
        var $image = $(image).height('100%').width('100%');
        var size = getImagePlayerSize(image);
        $player.height(size.height);
        $player.width(size.width);
        $player.append($image);

        /*jshint -W030*/
        $image.attr('src','');
        image.offsetHeight; // a hack to force redraw in Chrome to start cached .gif from the first frame
        $image.attr('src',imgUrl);
        /*jshint +W030*/

        // remove splash
        $box.css('background-image', 'none');

        Player.autosize = function() {
          $player.animate(_.pick(getImagePlayerSize(image), 'height', 'width'), 400);
        };

        if (Playlist.multivideo) {
          // no need to worry about potentially badly defined value of timerId, because:
          // 1. we are single threaded
          // 2. callbacks do not interrupt anything
          $player.on('destroyed', onImgurPlayerRemove);
          timerId = _.delay(onImgurPlayerStateChange, 1000*(playback.start || 3)); // milis
        }

      });

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

  var editorNotification = null;

  Player.registerEditorNotification = function(handler) {
    if (_.isFunction(handler)) {
      editorNotification = handler;
    }
  };

  Player.unregisterEditorNotification = function() {
    editorNotification = null;
  };

  Player.newPlayer = function(playback) {
    logLady('Player.newPlayer()', playback);

    var $player = $('#player');
    if ($player.length) {
      $player.remove();
    }

    $('#box').html('<div id="player"></div>');

    if (editorNotification) {
      // inform editor about player change
      editorNotification();
    }

    // prevalidated! no need to check ^e_
    Player.engine = PLAYER_TYPES[playback.urlKey].engine;
    Player.engine.newPlayer(playback);

  };

  Playlist(window.location.href);
  Playlist.log();

  YouTubePlayer();
  ImgurPlayer();

  Player.newPlayer(Playlist.current());
  showRandomUi(Playlist.multivideo);
}


function onYouTubeIframeAPIReady() {
  logLady('onYouTubeIframeAPIReady()');
  Player();
  registerEditor();
}


function initYT() {
  var tag = document.createElement('script');
  tag.src = '//www.youtube.com/iframe_api';
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}


function renderPage() {
  var video = getVideo(window.location.href);
  var $box = $('#box').show();
  if (video.urlKey == 'v') {
    // splash screen
    $box.css('background-image', 'url(//img.youtube.com/vi/' + video.videoId + '/hqdefault.jpg)');
    initYT();
  } else if (video.urlKey == 'i') {
    initYT();
  } else {
    changeFavicon();
    $box.hide();
    showHelpUi(true);
  }
}


function responsivePlayerSetup() {
  var cookieKey     = 'no_autosize';
  var cookie        = $.cookie(cookieKey);
  var cookieOptions = { expires: 365, path: '/', secure: false };
  var $responsive   = $('#responsive');

  if (cookie === undefined) {
    $.cookie(cookieKey, true, cookieOptions);
    $responsive.removeClass('ticker');
  } else {
    $.removeCookie(cookieKey, cookieOptions);
    $responsive.addClass('ticker');
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
    $('#box').show();
    showHelpUi(false);

    // reset player or entire page
    if ($('#player').length > 0) {
      onYouTubeIframeAPIReady();
    } else {
      renderPage();
    }
  });


  // menu items will now commence!

  $('#shorten').click(_.debounce(showShortUrl, 1000, true));
  $('#help-toggle').click(function(){showHelpUi(!$('#help').is(':visible'));});

  // #autosize
  var $responsive = $('#responsive');
  $responsive.click(responsivePlayerSetup);
  // display current autosize setting in menu
  if ($.cookie('no_autosize')) { $responsive.removeClass('ticker'); }
  else                         { $responsive.addClass('ticker');    }
  // update player on window resize if autosize is enabled
  $(window).on('resize', _.debounce(function() {
    if ($.cookie('no_autosize') === undefined && Player.autosize) {
      Player.autosize();
    }
  }, 300));


  // keyboard shortcuts will now commence!
  $(document).unbind('keypress').keypress(function(e) {
    var k = String.fromCharCode(e.which).toLowerCase();
    //logLady('key/code:'+k+'/'+e.which);
    if (k=='?') {
      $('#help-toggle').click();

    } else if (k=='s') {
      var $shorten = $('#shorten');
      if ($shorten.is(':visible')) {
        $shorten.click();
      }

    } else if (k=='b') {
      $('#box').slideToggle();

    } else if (k=='x') {
      var $box = $('#box');
      if (Player.engine === YouTubePlayer) {
        if (YT.PlayerState.PLAYING === YouTubePlayer.instance.getPlayerState()) {
          YouTubePlayer.instance.pauseVideo();
          $box.hide();
        } else {
          YouTubePlayer.instance.playVideo();
          $box.show();
        }
      } else {
        $box.toggle();
      }

    } else if (k=='r') {
      if (Playlist.intervals) {
        Player.newPlayer(Playlist.random());
      }
    } else if (k==' ') {
      if (Player.engine === YouTubePlayer) {
        if (YT.PlayerState.PLAYING === YouTubePlayer.instance.getPlayerState()) {
          YouTubePlayer.instance.pauseVideo();
        } else {
          YouTubePlayer.instance.playVideo();
        }
      }

    } else if (Playlist.go) {
      var change = k=='k' ? Playlist.go('prevV')
                 : k=='j' ? Playlist.go('nextV')
                 : k=='h' ? Playlist.go('prevI')
                 : k=='l' ? Playlist.go('nextI')
                 : null;
      if (change) Player.newPlayer(change);
    }
  });


  // enable dom element removal notification (because of reasons sic)
  $.event.special.destroyed = { remove: function(o){ if (o.handler) {o.handler();} } };

}(jQuery));

// vim:ts=2:sw=2:et:
