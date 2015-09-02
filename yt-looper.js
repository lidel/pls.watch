'use strict';

// document.head (http://jsperf.com/document-head) failsafe init for old browsers
if (!document.head) {
  document.head = document.getElementsByTagName('head')[0];
}

// be happy with HTTP 304 where possible
$.loadCachedScript = function (url, options) {
  return $.ajax($.extend(options || {}, {
            dataType: 'script',
            cache: true,
            url: url
         }));
};

/* global YT, SC, Editor */

// HALPERS
function logLady(a, b) { // kek
  console.log(!_.isString(a) ? JSON.stringify(a)
                             : b ? a +': '+ JSON.stringify(b)
                                 : a);
}

function isEmbedded() {
  return window.location != window.parent.location;
}

function isAutoplay() {
  return !isEmbedded() || !_.isUndefined(isEmbedded.clickedPlay);
}

function isFullscreen() {
  var fullScreenElement = document.fullScreenElement || document.mozFullScreenElement || document.webkitFullScreenElement || document.webkitFullscreenElement;
  return fullScreenElement !== undefined && fullScreenElement !== null;
}

// YouTube IFrame API
function initYT(callback) {
  if (typeof YT === 'undefined') {
    onYouTubeIframeAPIReady.callback = callback;
    $.loadCachedScript('https://www.youtube.com/iframe_api');
  } else {
    callback();
  }
}

// SoundCloud IFrame API
function initSC(callback) {
  if (typeof SC === 'undefined') {
    $.loadCachedScript('https://w.soundcloud.com/player/api.js').done(callback);
  } else {
    callback();
  }
}

// ICONS
var faviconPlay  = 'assets/play.ico';
var faviconPause = 'assets/pause.ico';
var faviconWait  = 'assets/wait.ico';

// PROTOTYPES (fufuf jshitn!)
var Player, YouTubePlayer, ImgurPlayer, SoundCloudPlayer;


// ENUMS
var YT_PLAYER_SIZES = Object.freeze({ // size reference: http://goo.gl/45VxXT
                        small:   {width:  320,  height:  240},
                        medium:  {width:  640,  height:  360},
                        large:   {width:  853,  height:  480},
                        hd720:   {width: 1280,  height:  720},
                        hd1080:  {width: 1920,  height: 1080}
                      });

var PLAYER_TYPES = Object.freeze({
                     v: {engine: YouTubePlayer,    api: initYT },
                     i: {engine: ImgurPlayer,      api: null   },
                     s: {engine: SoundCloudPlayer, api: initSC }
                   });

var PLAYER_TYPES_REGX = '['+ _(PLAYER_TYPES).keys().join('') +']'; // nice halper

// This API key works only with yt.aergia.eu domain
// Key for different referer can be generated at https://console.developers.google.com
var GOOGLE_API_KEY = 'AIzaSyDp31p-15b8Ep-Bfnjbq1EeyN1n6lRtdmU';

// This Client ID is fairly disposable (used only for fetching image metadata)
var IMGUR_API_CLIENT_ID = '494753a104c250a';



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

function showEmbedCode() {
    var input = '<input type="text" readonly>';
    var span = '<span id="embed-code">ctrl+c to copy '+ input +'</span>';
    $('#embed-toggle').hide();
    $('#embed-ui').prepend(span);
    var $input = $('#embed-ui input');
    $input.val('<iframe width="420" height="315" src="'+ window.location.href +'" frameborder="0" allowfullscreen></iframe>');
    $input.width('20em');
    $input.select();
    $input.click(function(){ $input.select(); });
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


function getPlayerSize(engine) {
  if (isEmbedded() || isFullscreen()) {
    var $view = $('body');
    var iframeW= $view.innerWidth();
    var iframeH= $view.innerHeight();
    return { width: iframeW, height: iframeH };
  }

  var docWidth  = $(document).width()  * 0.8; // UX hack
  var docHeight = $(document).height() * 0.8;
  var size      = {width: docWidth, height: docHeight};

  if (engine === YouTubePlayer) {
    size = YT_PLAYER_SIZES.small;
    $.when($.each(YT_PLAYER_SIZES, function(k, v) {
      if (v.width > size.width && v.width < docWidth && v.height < docHeight) {
        size = YT_PLAYER_SIZES[k];
      }
    })).done(function() {
      logLady('Calculated YouTube player size', size);
    });
  }

  return size;
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
  $.ajax({ url: apiRequest, async: false}).done(function(data) {
    var item = data.items[0];
    // if position does match, remove duplicate from URL
    if (data.length > 0 && item.kind === 'youtube#playlistItem' && item.snippet.position == parseInt(index,10)-1) {
      normalizedUrl = normalizedUrl.replace(/([#&])(v=[^&]+&)(list=[^&]+&index=[^&]+|index=[^&]+&list=[^&]+)/, '$1$3');
    }
  }).fail(function(jqxhr, textStatus) {
    if (jqxhr.status === 404) {
      // videoId is not a member of playlistId
      // no need to change URL
    } else {
      logLady('Unable to get YouTube playlistId='+playlistId+' ('+ textStatus +'): ', jqxhr);
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

  // hack to provide static API response for unit test
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

function inlineShortenedPlaylist(urlMatch, shortUrl) {
  var normalizedUrl = urlMatch;
  var apiRequest = 'https://www.googleapis.com/urlshortener/v1/url'
                  + '?key=' + GOOGLE_API_KEY
                  + '&shortUrl=' + shortUrl;

  $.ajax({ url: apiRequest, async: false}).done(function(data) {
    if (data.kind === 'urlshortener#url' && data.longUrl.indexOf('#') > -1) {
      normalizedUrl = data.longUrl.split('#')[1];
    }
  }).fail(function(jqxhr, textStatus) {
    logLady('Unable to inline Short URL "'+ shortUrl +'" ('+ textStatus +'): ', jqxhr);
  });

  return normalizedUrl;
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

  // inline playlists
  apiUrl = apiUrl.replace(/[#&]v=([^&]+)&list=([^&]+)&index=([^&]+)/g, deduplicateYTPlaylist);
  apiUrl = apiUrl.replace(/[#&]v=([^&]+)&index=([^&]+)&list=([^&]+)/g, function($0,$1,$2,$3){return deduplicateYTPlaylist($0,$1,$3,$2);});
  apiUrl = apiUrl.replace(/(#.+&|#)list=[^&]+&index=(\d+)/g, recalculateYTPlaylistIndex);
  apiUrl = apiUrl.replace(/(#.+&|#)index=(\d+)&list=[^&]+/g, recalculateYTPlaylistIndex);
  apiUrl = apiUrl.replace(/list=([^&:#]+)/g, inlineYTPlaylist);
  apiUrl = apiUrl.replace(/(https?:\/\/goo\.gl\/[^&#]+)/g, inlineShortenedPlaylist);

  if (!href && url != apiUrl) document.location.replace(apiUrl);

  return apiUrl;
}


function showHelpUi(show) {
  var $help = $('#help');
  var $helpUi = $('#help-ui');
  var $helpToggle = $('#help-toggle', $helpUi);
  if (show && !$help.is(':visible')) {
    $helpToggle.addClass('ticker');
    $help.css('display', 'block').fadeIn('fast');


    // lazy init for a pretty scrollbar
    if (!$help.hasClass('mCustomScrollbar') && $help.get(0).scrollHeight > $('body').get(0).clientHeight) {
      $LAB
      .script(function () {
          // lazy load scrollbar assets
          if (!$.mCustomScrollbar) {
            $('<link>')
              .appendTo('head')
              .attr({type : 'text/css', rel : 'stylesheet'})
              .attr('href', 'https://cdn.jsdelivr.net/jquery.mcustomscrollbar/3.0.6/jquery.mCustomScrollbar.min.css');
            return 'https://cdn.jsdelivr.net/jquery.mcustomscrollbar/3.0.6/jquery.mCustomScrollbar.concat.min.js';
          } else {
            return null;
          }
        })
      .wait(function(){
        $help.mCustomScrollbar({
          axis: 'y',
          mouseWheel: { axis: 'y' },
          scrollInertia: 0,
          theme: 'minimal'
        }).css('padding-right','16px');
      });
    }

  } else if (!show && $help.is(':visible')) {
    $helpToggle.removeClass('ticker');
    $help.fadeOut('fast');
  }
}

function showRandomUi(multivideo) {
  var $randomUi = $('#random-ui');
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
  } else {
    $randomUi.hide();
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


// reloadable singleton! d8> ...kek wat? fuf! o_0
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

  showRandomUi(Playlist.multivideo);
}

function setSplash(imgUrl) {
  if (imgUrl) {
    $('#box').css('background-image', 'linear-gradient(rgba(0,0,0,0.45),rgba(0,0,0,0.45)),url(' + imgUrl + ')');
  } else {
    $('#box').css('background-image', 'none');
  }
}

// Fix for IFrame-based players that steal focus and break keyboard shortcuts
function returnFocus() {
  //logLady('before returnFocus(): '+ document.activeElement.tagName + ' is focused');
  if(document.activeElement.tagName == 'IFRAME') {
    document.body.tabIndex = 1; // default is -1 (disabled focus)
    document.body.focus();
    //logLady('after returnFocus(): '+document.activeElement.tagName + ' is focused');
  }
}

// reloadable singleton! d8> ...kek wat? fuf! o_0
function YouTubePlayer() {
  logLady('YouTubePlayer()');

  YouTubePlayer.newPlayer = function(playback) {
    var size = getPlayerSize(YouTubePlayer);

    // splash
    setSplash('https://i.ytimg.com/vi/' + playback.videoId + '/default.jpg');

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
        fs: '0',
      },
      events: {
        onReady: onYouTubePlayerReady,
        onStateChange: onYouTubePlayerStateChange
      }
    });

    Player.toggle = function() {
      if (YT.PlayerState.PLAYING === YouTubePlayer.instance.getPlayerState()) {
        YouTubePlayer.instance.pauseVideo();
      } else {
        YouTubePlayer.instance.playVideo();
      }
    };

    Player.volume = function(diff) {
      var current = YouTubePlayer.instance.getVolume();
      if (diff) {
        var diffd = current + diff;
        var normalized = diffd < 0 ? 0 : diffd > 100 ? 100 : diffd;
        YouTubePlayer.instance.setVolume(normalized);
      } else {
        return current;
      }
    };

    Player.autosize = function() {
      var size = getPlayerSize(YouTubePlayer);

      var $box = $('#box');
      // adjust #box size before animation to fix padding issues
      $box.css('max-width',  size.width);
      $box.css('max-height', size.height);

      $('#player').animate(_.pick(size, 'width', 'height'), 400)
        .promise().done(function() {
          // just to be sure player noticed resize..
          YouTubePlayer.instance.setSize(size.width, size.height);
        });
    };

    Player.autosize();
  };

  var onYouTubePlayerReady = function(event) {
    logLady('onYouTubePlayerReady()');

    $(document).prop('title', event.target.getVideoData().title);
    setSplash(null);

    var quality = urlParam('quality');
    if (quality) {
      event.target.setPlaybackQuality(quality);
    }

    if (isAutoplay()) event.target.playVideo();
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
      if (isEmbedded()) {
        isEmbedded.clickedPlay = true;
      }
    } else if ($('#box').is(':visible') || !event.target.isMuted()) {
      if (event.data == YT.PlayerState.PAUSED) {
        changeFavicon(faviconPause);
      } else {
        changeFavicon(faviconWait);
      }
    }
    returnFocus();
  };
}


// reloadable singleton! d8> ...kek wat? fuf! o_0
function ImgurPlayer() { /*jshint ignore:line*/
  logLady('ImgurPlayer()');

  var imgurCDN = 'https://i.imgur.com/';

  ImgurPlayer.newPlayer = function(playback) {
    var $player = $('div#player');

    // Imgur will return a redirect instead of an image
    // if file extension is missing, so we need to make sure
    // it is always present (any extension will do)
    var imgurUrl = function(resource) {
      var url = imgurCDN + resource;
      return /\.[a-z]+$/i.test(resource) ? url : url + '.jpg';
    };
    var imgUrl  = imgurUrl(playback.videoId);

    var getImagePlayerSize = function(imgW, imgH) {
      var p = _.extend({}, getPlayerSize(ImgurPlayer));
      var w = Math.floor(imgW * (p.height / imgH));
      var h = Math.floor(imgH * (p.width  / imgW));
      p.width  = Math.min(w, p.width);
      p.height = Math.min(h, p.height);
      return p;
    };
    var setImagePlayerSize = function($player, w, h) {
      logLady('setImagePlayerSize(_,'+w+','+h+')');
      Player.autosize = function() {
        var size = getImagePlayerSize(w, h);

        var $box = $('#box');
        // adjust #box size before animation to fix padding issues
        $box.css('max-width',  size.width);
        $box.css('max-height', size.height);

        $player.animate(_.pick(size, 'width', 'height'), 400);
      };
      Player.autosize();
    };

    var startSlideshowTimerIfPresent = function () {
      if (Playlist.multivideo && playback.start > 0) {
        $player.on('destroyed', onImgurPlayerRemove);
        ImgurPlayer.timerId = _.delay(onImgurPlayerStateChange, 1000*playback.start); // milis
      }
    };


    // smart splash screen
    changeFavicon(faviconWait);
    $(document).prop('title', playback.videoId);
    $player.html('<div class="spinner"></div>');
    // the smallest thumb with preserved aspect ratio has suffix 't'
    var thumbUrl = imgurUrl(playback.videoId.replace(/^([a-zA-Z0-9]+)/, '$1t'));
    setSplash(thumbUrl);

    // fetching image metadata (mainly to detect GIFs)
    var apiData = null;
    $.ajax({ url: 'https://api.imgur.com/3/image/' + playback.videoId.replace(/\.\w+$/,''),
             headers: { 'Authorization': 'Client-ID ' + IMGUR_API_CLIENT_ID },
             async: false
    }).done(function(data) {
      if (data.data) apiData = data.data;
      setImagePlayerSize($player, apiData.width, apiData.height);
      //logLady('Received Imgur MetaData: ', apiData);
    }).fail(function(jqxhr, textStatus) {
      logLady('Unable to get metadata about Imgur resource "'+playback.videoId+'" ('+ textStatus +'): ', jqxhr);
      // read ratio from thumbnail as a falback
      $('<img/>')
        .attr('src', thumbUrl)
        .on('load', function() {
          setImagePlayerSize($player, this.naturalWidth, this.naturalHeight);
        });
    });

    if (apiData && apiData.animated) {
      logLady('GIFV detected, switching to HTML5 <video> player');

      var https = function(url) {
        return url.replace('http:','https:');
      };

      var $gifv = $('<video id="gifv" width="100%" height="100%" '
                + '         poster="'+ imgurUrl(playback.videoId.replace(/^([a-zA-Z0-9]+)/, '$1t')) + '" '
                + '         autoplay="autoplay" muted="muted" preload="auto" loop="loop">'
                + '<source src="'+ https(apiData.webm) +'" type="video/webm">'
                + '<source src="'+ https(apiData.mp4) +'" type="video/mp4">'
                + '</video>').bind('play', startSlideshowTimerIfPresent);

      $player.empty().append($gifv);
      setSplash(null);
      changeFavicon(faviconPlay);

    } else {
      $('<img/>')
        .attr('src', imgUrl)
        .on('load', function() {
          var image = this;
          var $image = $(image).height('100%').width('100%');
          $player.empty().append($image);

          /*jshint -W030*/
          $image.attr('src','');
          image.offsetHeight; // a hack to force redraw in Chrome to start cached .gif from the first frame
          $image.attr('src',imgUrl);
          /*jshint +W030*/

          setSplash(null);
          changeFavicon(faviconPlay);
          startSlideshowTimerIfPresent();
        });
    }

    Player.toggle = null;
  };

  var onImgurPlayerStateChange = function() {
    Player.newPlayer(Playlist.cycle());
  };

  var onImgurPlayerRemove = function() {
    window.clearTimeout(ImgurPlayer.timerId);
  };
}

function SoundCloudPlayer() {
  logLady('SoundCloudPlayer()');

  SoundCloudPlayer.newPlayer = function(playback) {
    $(document).prop('title', playback.videoId);
    changeFavicon(faviconWait);

    var $box    = $('#box');
    var $player = $('<iframe id="player"/>').css('opacity','0.25');

    var widgetUrl = 'https://w.soundcloud.com/player/'
                  + '?url=https%3A%2F%2Fsoundcloud.com/' + playback.videoId
                  + '&auto_play=false&buying=false&liking=false&download=false&sharing=false'
                  + '&show_comments=false&show_playcount=false'
                  + '&show_artwork=true&show_user=true&hide_related=true&visual=true&callback=true';

    $player.attr('src', widgetUrl);
    $('div#player').replaceWith($player).remove();

    SoundCloudPlayer.instance = SC.Widget($player.get(0));

    var sc = SoundCloudPlayer.instance;
    var init = true; // due to poor API we need to use first PLAY event for init

    // splash screen
    sc.getCurrentSound(function (a) {
      setSplash(a.artwork_url.replace('large','mini'));
    });

    var playbackEnded = function () {
      changeFavicon(faviconWait);
      /* TODO: broken for now. widget does not behave deterministically
       * either middle interval fails to loop, or the one at the end
       * the only way to get it working was to reload entire player
       * Update: potentially can be fixed by single_active=false
      if (Playlist.multivideo) {
        Player.newPlayer(Playlist.cycle());
      } else {
        init = true;
        //sc.pause();
        //sc.seekTo(1000*Playlist.current().start);
        sc.play();
      }
      */
      Player.newPlayer(Playlist.cycle());
    };

    sc.bind(SC.Widget.Events.PLAY, function() {
      if (init) {
        sc.getCurrentSound(function (sound) {
          $(document).prop('title', sound.title);
        });
        sc.seekTo(1000*playback.start);
        $player.css('opacity', '1');
        setSplash(null);
        init = false;
      }
      changeFavicon(faviconPlay);
      if (isEmbedded()) {
        isEmbedded.clickedPlay = true;
      }
      returnFocus();
    });

    sc.bind(SC.Widget.Events.PAUSE, function() {
      if ($box.is(':visible')) {
        changeFavicon(faviconPause);
      }
      returnFocus();
    });

    sc.bind(SC.Widget.Events.PLAY_PROGRESS, function(e) {
      if (playback.end && e.currentPosition >= playback.end*1000) {
        playbackEnded();
      }
      returnFocus();
    });

    sc.bind(SC.Widget.Events.FINISH, function() {
      playbackEnded();
    });

    sc.bind(SC.Widget.Events.READY, function() {
      // inline playlists
      if (playback.videoId.indexOf('/sets/') > -1) {
        logLady('SoundCloud set detected, inlining intervals..');
        sc.getSounds(function (sounds) {
          var uris = _.map(sounds,  function(s){return s.permalink_url.replace('https://soundcloud.com/', 's=');});
              uris = _.reduce(uris, function(uris,uri){return uris+'&'+uri;});
          document.location.replace(document.location.href.replace('s='+playback.videoId,uris));
          return;
        });
      }
      if (isAutoplay()) {
        sc.play();
      } else {
        $player.css('opacity', '1');
      }
    });

    Player.toggle = function() {
      SoundCloudPlayer.instance.toggle();
    };

    Player.volume = function(diff) {
      if (diff) {
        SoundCloudPlayer.instance.getVolume(function (current) {
          var diffd = current + diff;
          var normalized = Math.floor(diffd < 0 ? 0 : diffd > 100 ? 100 : diffd);
          SoundCloudPlayer.instance.setVolume(normalized);
        });
      }
    };

    Player.autosize = function() {
      var size = getPlayerSize(SoundCloudPlayer);

      var $box = $('#box');
      // adjust #box size before animation to fix padding issues
      $box.css('max-width',  size.width);
      $box.css('max-height', size.height);

      $player.animate(_.pick(size, 'width', 'height'), 400);
    };
    Player.autosize();

  };

}



// reloadable singleton! d8> ...kek wat? fuf! o_0
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

    if (_.isFunction(editorNotification)) editorNotification();

    var initPlayer = function() {
      $('#box').html('<div id="player"></div>');
      Player.engine();
      Player.engine.newPlayer(playback);
    };

    Player.engine  = PLAYER_TYPES[playback.urlKey].engine;
    var initApi    = PLAYER_TYPES[playback.urlKey].api;
    if (_.isFunction(initApi)) {
      initApi(initPlayer);
    } else {
      initPlayer();
    }
  };

  Player.fullscreenToggle = function() {
      if (!isFullscreen()) {
        var fs = $('body')[0];
        var requestFullScreen = fs.requestFullScreen || fs.mozRequestFullScreen || fs.webkitRequestFullScreen;
        if (requestFullScreen) {
          requestFullScreen.bind(fs)();
        }
      } else {
        var cancelFullScreen = document.cancelFullScreen || document.mozCancelFullScreen || document.webkitCancelFullScreen;
        if (cancelFullScreen) {
          cancelFullScreen.bind(document)();
        }
      }
      logLady('isFulscreen()=' +  isFullscreen());
  };

  /*jshint -W064*/
  Playlist(window.location.href);
  Playlist.log();
  /*jshint +W064*/

  Player.newPlayer(Playlist.current());
}


function initLooper() {
  logLady('initLooper()');
  if (isEmbedded()) {
    $('#help').remove();
    $('#editor').remove();
    $('#menu').remove();
    $('body').append($('<a id="embed" href="'+ window.location.href +'" target="_blank">&#x21BB;</a>'));
  }
  /*jshint -W064*/
  Player();
  Editor(Playlist, Player);
  /*jshint +W064*/
}

function onYouTubeIframeAPIReady() { /*jshint ignore:line*/
  logLady('onYouTubeIframeAPIReady()');
  if (_.isFunction(onYouTubeIframeAPIReady.callback)) onYouTubeIframeAPIReady.callback();
}

function renderPage() {
  var video = getVideo(window.location.href);
  logLady(video);
  var $box = $('#box').show();
  var $menu = $('#menu').show();

  // early splash screen if YouTube image is the first interval
  if (video.urlKey == 'v') {
    setSplash('https://i.ytimg.com/vi/' + video.videoId + '/default.jpg');
  }

  if (PLAYER_TYPES.hasOwnProperty(video.urlKey)) {
    initLooper();
  } else {
    // no valid hash, display #help
    changeFavicon();
    $box.hide();
    $menu.hide();
    showHelpUi(true);
  }
}


// various init tasks on page load
(function($) {
  $(window).bind('hashchange', function() {
    logLady('hash change: ' + window.location.hash);

    normalizeUrl();

    // reset things that depend on URL
    $('#shortened').remove();
    $('#shorten').show();

    $('#embed-code').remove();
    $('#embed-toggle').show();

    $('#box').show();
    showHelpUi(false);

    // reset player or entire page
    if ($('#player').length > 0) {
      initLooper();
    } else {
      renderPage();
    }
  });


  // menu items will now commence!

  $('#shorten').click(_.debounce(showShortUrl, 1000, true));
  $('#embed-toggle').click(showEmbedCode);
  $('#help-toggle').click(function(){showHelpUi(!$('#help').is(':visible'));});

  // update player on window resize if autosize is enabled
  $(window).on('resize', _.debounce(function() {
    if (_.isFunction(Player.autosize)) {
      Player.autosize();
    }
  }, 300));

  // hide menu when in fullscreen
  $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange', function() {
    if (isFullscreen()) {
      $('#menu').hide();
    } else {
      $('#menu').show();
    }
  });

  // keyboard shortcuts will now commence!
  $(document).unbind('keypress').keypress(function(e) {
    var k = (Editor.editInProgress === undefined && !isEmbedded())
          ? String.fromCharCode(e.which).toLowerCase() : undefined;
    //logLady('key/code:'+k+'/'+e.which);
    if (k==='?') {
      $('#help-toggle').click();

    } else if (k==='e') {
      $('#editor-toggle').click();

    } else if (k==='s') {
      var $shorten = $('#shorten');
      if ($shorten.is(':visible')) {
        $shorten.click();
      }

    } else if (k==='f') {
      Player.fullscreenToggle();

    } else if (k==='b') {
      $('#box').slideToggle();

    } else if (k==='x') {
      var $box = $('#box');
      if ($box.is(':visible')) {
        $box.hide();
        $('#help').hide();
        $('#editor').hide();
        if (Player.engine === YouTubePlayer && YT.PlayerState.PLAYING === YouTubePlayer.instance.getPlayerState()) {
          YouTubePlayer.instance.mute();
          YouTubePlayer.instance.pauseVideo();
        }
        else if (Player.engine === SoundCloudPlayer) {
          SoundCloudPlayer.instance.pause();
        }
        $(document).prop('title', 'Google');
        changeFavicon('https://www.google.com/favicon.ico');
      } else {
        $box.show();
        if (Player.engine === YouTubePlayer && YT.PlayerState.PLAYING !== YouTubePlayer.instance.getPlayerState()) {
          YouTubePlayer.instance.unMute();
          YouTubePlayer.instance.playVideo();
          $(document).prop('title', YouTubePlayer.instance.getVideoData().title);
        }
        else if (Player.engine === SoundCloudPlayer) {
          SoundCloudPlayer.instance.play();
          SoundCloudPlayer.instance.getCurrentSound(function (sound) {
            $(document).prop('title', sound.title);
          });
        }
      }

    } else if (k==='r') {
      if (Playlist.intervals) {
        Player.newPlayer(Playlist.random());
      }
    } else if (k==='m') {
      switch(Player.engine) {
        case YouTubePlayer:
          if (YouTubePlayer.instance.isMuted()) {
            YouTubePlayer.instance.unMute();
          } else {
            YouTubePlayer.instance.mute();
          }
          break;
        case SoundCloudPlayer:
          // There is no video, so we pause instead
          SoundCloudPlayer.instance.toggle();
          break;
     }

    } else if (k==='+' || k==='=') {
      if (Player.volume) {
        Player.volume(+10);
      }

    } else if (k==='-' || k==='_') {
      if (Player.volume) {
        Player.volume(-10);
      }

    } else if (k===' ') {
      if (Player.toggle) {
        Player.toggle();
      }

    } else if (Playlist.go) {
      var change = k==='k' ? Playlist.go('prevV')
                 : k==='j' ? Playlist.go('nextV')
                 : k==='h' ? Playlist.go('prevI')
                 : k==='l' ? Playlist.go('nextI')
                 : null;
      if (change) Player.newPlayer(change);
    }
  });


  // enable dom element removal notification (because of reasons sic)
  $.event.special.destroyed = { remove: function(o){ if (o.handler) {o.handler();} } };

}(jQuery));

// vim:ts=2:sw=2:et:
