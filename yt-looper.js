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

function cookieMonster(key, value) { // hihi
  if (value !== undefined) {  // naive implementation: set, get, !remove
    var cookie = _.template(
      '<%= key %>=<%= value %>; path=/'
    );
    document.cookie = cookie({ key: key, value: value });
  } else {
    var regx = new RegExp('^[ ]*'+ key +'=');
    var result;
    _(document.cookie.split(';')).find(function(cookie) {
      var match = cookie.match(regx);
      if (match) {
        result = cookie.substr(match[0].length);
        return true;  // breaks the loop
      }
    });
    return result;
  }
}

function isEmbedded() {
  return window.location != window.parent.location;
}

function isAutoplay() {
  return !isEmbedded() || !_.isUndefined(isEmbedded.clickedPlay);
}

function isFullscreen() {
  // Historically, Fullscreen API was a big turd of bikeshedding:
  // https://web.archive.org/web/20160626102855/https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API#Prefixing
  var d = document;
  var fs = d.fullscreenElement
    || d.fullScreenElement
    || d.mozFullScreenElement
    || d.webkitFullScreenElement
    || d.webkitFullscreenElement;
  return fs !== undefined && fs !== null;
}

// YouTube IFrame API
function initYT(callback) {
  if (typeof YT === 'undefined') {
    onYouTubeIframeAPIReady.callback = callback;
    $.loadCachedScript('https://www.youtube.com/player_api');
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
var Player, YouTubePlayer, ImgurPlayer, SoundCloudPlayer, HTML5Player, ImagePlayer;


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
                     V: {engine: HTML5Player,      api: null   },
                     i: {engine: ImgurPlayer,      api: null   },
                     I: {engine: ImagePlayer,      api: null   },
                     s: {engine: SoundCloudPlayer, api: initSC }
                   });

var PLAYER_TYPES_REGX = '['+ _(PLAYER_TYPES).keys().join('') +']'; // nice halper

// This API key works only with yt.aergia.eu domain
// Key for different referer can be generated at https://console.developers.google.com
var GOOGLE_API_KEY = 'AIzaSyDp31p-15b8Ep-Bfnjbq1EeyN1n6lRtdmU';

// This Client ID is fairly disposable (used only for fetching image metadata)
var IMGUR_API_CLIENT_ID = '494753a104c250a';

var AUTOSIZE_TIME = 200;

var EXTERNAL_URI = [ /^https?:\/\/.+/,
                     /^goo\.gl\/.+/,
                     /^\/ip[fn]s\/.+/  ];

function isExternalURI(videoId) {
  var r = _(EXTERNAL_URI).find(function(regx) {
    return videoId.match(regx);
  });
  return r !== undefined;
}

// Displays notification in top right corner
function notification(type, title, message, options) {
  if (!_.isObject(options)) {
    options = {};
  }

  // lazy load of assets
  $LAB
  .script(function () {
    if (typeof toastr === 'undefined') {
        $('<link>')
          .appendTo('head')
          .attr({type : 'text/css', rel : 'stylesheet'})
          .attr('href', 'https://cdn.jsdelivr.net/toastr/2.1.3/toastr.min.css');
        return 'https://cdn.jsdelivr.net/toastr/2.1.3/toastr.min.js';
    } else {
      return null;
    }
  })
  .wait(function(){
    if (type === 'error') {
      options = _.extend(options, {closeButton: true, timeOut: 0, extendedTimeOut: 0});
    }
    toastr[type](message, title, options); // eslint-disable-line no-undef
  });
}

function osd(message) {
  notification('info', message, null, {showDuration: 0, hideDuration: 0, timeOut: 750});
}

/* Styling help
notification('success', 'test1','test',{timeOut: 0, extendedTimeOut: 0});
notification('info', 'test2','test',{timeOut: 0, extendedTimeOut: 0});
notification('warning', 'test3','test',{timeOut: 0, extendedTimeOut: 0});
notification('error', 'test4','test',{timeOut: 0, extendedTimeOut: 0});
*/

function initCRC32() { // http://jsperf.com/js-crc32
  var c;
  var crcTable = [];
  for(var n=0; n<256; n++) {
    c = n;
    for(var k=0; k<8; k++) {
      c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    crcTable[n] = c;
  }
  return crcTable;
}

function crc32(str) {
  var crcTable = window.crcTable || (window.crcTable = initCRC32());
  var crc = 0 ^ (-1);
  for (var i=0; i<str.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

function encodeToken(data) {
  // concatenate ascii-only char codes (in hex)
  var result = '', index = 0, charCode, esc;
  while (!isNaN(charCode = data.charCodeAt(index++))) {
    esc = charCode.toString(16);
    if (charCode < 256) {
        result += (charCode > 15 ? '' : '0') + esc;
    } else {
      return '';
    }
  }
  // append checksum
  result += '.' + crc32(data).toString(16);
  return result.toUpperCase();
}

function decodeToken(token) {
  var tokens = token.split('.');
  var tokenData = tokens[0].match(/.{2}/g) || [];
  var tokenChecksum = parseInt(tokens[1],16) || 0;

  tokenData = _.map(tokenData, function(hex) {
    return parseInt(hex, 16);
  });

  var playlist = String.fromCharCode.apply(String, tokenData);

  // check checksum
  if (crc32(playlist) !== tokenChecksum) {
    logLady('decodeToken: invalid CRC32, ignoring token', token);
    notification('error', 'Invalid URL Token', 'Impacted playlist items were removed.');
    //logLady('expected CRC', tokenChecksum);
    //logLady('parsed CRC', crc32(playlist));
    return '';
  }

  return playlist;
}

function copyToClipboard(text) {
  if (document.queryCommandSupported('copy')) {
    var copyElem = document.createElement('textarea');
    copyElem.style.position = 'absolute';
    copyElem.style.left = '-9999px';
    copyElem.setAttribute('readonly', '');
    copyElem.value = text;
    document.body.appendChild(copyElem);
    copyElem.select();
    var copied = document.execCommand('copy');
    document.body.removeChild(copyElem);
    return copied;
  } else {
    return false;
  }
}

function showShortUrl() {
  var fallbackGui = function(text) {
    $('#shorten').hide();
    var input = '<input type="text" value="'+ text +'" readonly>';
    var     a = '<a href="'+ text +'" target="_blank" title="click to test short url in a new tab">&#10548;</a>';
    var  span = '<span id="shortened">ctrl+c to copy '+ input + a +'</span>';
    $('#menu').append(span);
    var $input = $('#shortened>input');
    $input.width(Math.ceil($input.val().length/1.9) + 'em');
    $input.select();
    $input.click(function(){ $input.select(); });
    notification('success', 'Short URL is ready: ' + text, 'Press CTRL+C to copy');
  };

  var hash = window.location.hash.replace('#', '');
  var longUrl = window.location.href.replace(hash, 'h=' + encodeToken(hash));

  $.ajax({
    url: 'https://www.googleapis.com/urlshortener/v1/url?key=' + GOOGLE_API_KEY,
    type: 'POST',
    contentType: 'application/json; charset=utf-8',
    data: '{ longUrl: "'+ longUrl +'" }',
    dataType: 'json',
    async: false,
    success: function(data) {
      logLady('data', data);
      if (copyToClipboard(data.id)) {
        notification('success', 'Copied to clipboard: ' + data.id,
            'Paste via CTRL+V <br/>See stats <a href="'+data.id+'.info">here</a>');
      } else {
        fallbackGui(data.id);
      }
    },
    error: function(jqxhr, textStatus) {
      var msg = 'Unable to get short URL: ';
      logLady(msg + textStatus, jqxhr);
      notification('error', 'goo.gl API Error', msg + 'check error in JS console');
    }
  });
}

function showEmbedCode() {
    var hash = window.location.hash.replace('#', '');
    var longUrl = window.location.href.replace(hash, 'h=' + encodeToken(hash));
    var embedCode = '<iframe width="420" height="315" src="'+ longUrl +'" frameborder="0" allowfullscreen></iframe>';

    var fallbackGui = function(embedCode) {
      var input = '<input type="text" readonly>';
      var span = '<span id="embed-code">ctrl+c to copy '+ input +'</span>';
      $('#embed-toggle').hide();
      $('#embed-ui').prepend(span);
      var $input = $('#embed-ui input');
      $input.val(embedCode);
      $input.width('20em');
      $input.select();
      $input.click(function(){ $input.select(); });
      notification('success', 'Embed Code is ready', 'Press CTRL+C to copy');
    };

    if (copyToClipboard(embedCode)) {
      notification('success', 'Embed code copied to clipboard', 'Paste it somewhere via CTRL+V');
    } else {
      fallbackGui(embedCode);
    }
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
  var w = window.innerWidth;
  var h = window.innerHeight;
  if (isEmbedded() || isFullscreen()) {
    return {width: w, height: h};
  }

  w = Math.floor(w * 0.8); // UX hack
  h = Math.floor(h * 0.8);

  var size = {width: w, height: h};

  if (engine === YouTubePlayer) {
    size = YT_PLAYER_SIZES.small;
    $.each(YT_PLAYER_SIZES, function(k, v) {
      if (v.width > size.width && v.width < w && v.height < h) {
        size = YT_PLAYER_SIZES[k];
      }
    });
  }
  logLady('getPlayerSize()', size);

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
  var ptrn = '(?:[#&]' + key + '[&$]*)';
  var rslt = new RegExp(ptrn).exec(window.location.href);
  return !rslt ? urlParam(key) == 'true' : true;
}

function urlParams() {// eslint-disable-line no-unused-vars
  return {
    index: urlParam('index'),
    quality: urlParam('quality'),
    volume: urlParam('volume'),
    random: urlFlag('random'),
    editor: urlFlag('editor')
  };
}

function urlArgs(params) {// eslint-disable-line no-unused-vars
  var suffix = function(a,v){return v === true ? '' : '=' + v;};
  var keys = _.sortBy(_.keys(params), function(s){return s;});
  return _.reduce(keys, function(a, b) {
    return params[b] ? a + '&' + b + suffix(a,params[b]) : a;
  }, '');
}

function parseVideos(url) {
  var ptrn = PLAYER_TYPES_REGX + '=[^&]*(?:[&]t=[^&]*)?';
  var regx = new RegExp(ptrn, 'g'), rslt;
  var vids = [];
  while ((rslt = regx.exec(url))) vids.push(rslt[0]);
  return vids;
}


function parseIntervals(v) {
  var floatSecond = function(t) {
    return parseFloat(t.replace(',', '.'), 10);
  };
  var getSeconds = function(t) {
    var tokens = /(\d+h)?(\d+m)?(\d+(?:\.\d+)?s)?/.exec(t); // converting from 1h2m3s
    var tt = 0;
    _(tokens).each(function(token, i) {
      if (token && i > 0) {
        if (token.indexOf('s') != -1) {
          tt += floatSecond(token.split('s')[0]);
        } else if (token.indexOf('m') != -1) {
          tt += 60 * parseInt(token.split('m')[0], 10);
        } else if (token.indexOf('h') != -1) {
          tt += 3600 * parseInt(token.split('h')[0], 10);
        }
      }
    });
    return tt > 0 ? tt : floatSecond(t);
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
  $.ajax({
    url: apiRequest,
    async: false,
    success: function(data) {
      // if position does match, remove duplicate from URL
      if (data.items.length > 0 && data.items[0].kind === 'youtube#playlistItem' && data.items[0].snippet.position+1 === Number(index)) {
        normalizedUrl = normalizedUrl.replace(/([#&])(v=[^&]+&)(list=[^&]+&index=[^&]+|index=[^&]+&list=[^&]+)/, '$1$3');
      }
    },
    error: function(jqxhr, textStatus) {
      if (jqxhr.status === 404) {
        // videoId is not a member of playlistId
        // no need to change URL
      } else {
        var msg = 'Unable to get playlistId='+playlistId+': ';
        logLady(msg + textStatus, jqxhr);
        notification('error', 'YouTube API Error', msg + 'check error in JS console');
      }
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
    while (retries>0 && (pageToken || !Object.keys(playlist).length)) {
      pageToken = (pageToken ? '&pageToken=' + pageToken : '');
      $.ajax({
        url: apiRequest+pageToken,
        async: false,
        success: function(data) {
          for (var i=0;i<data.items.length;i++) {
            var item = data.items[i];
            if (item.kind === 'youtube#playlistItem' && item.snippet.resourceId.kind === 'youtube#video') {
              playlist[item.snippet.position] = item.snippet.resourceId.videoId;
            }
          }
          pageToken = data.nextPageToken;
          retries = 3;
        },
        error: function(jqxhr, textStatus) {
          retries = retries - 1;
          if (retries < 1) {
            var msg = 'Unable to get playlistId='+playlistId+': ';
            logLady(msg + textStatus, jqxhr);
            if (jqxhr.status === 403) {
              msg = 'playlistId='+playlistId+' is not public and can\'t be displayed in yt-looper';
              notification('error', 'ERR-403: private playlist', msg);
            } else {
              notification('error', 'YouTube API Error', msg + 'check error in JS console');
            }
            // restore URL if all retries failed
            inlinedPlaylist = urlMatch;
          }
        }
      });
    }
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

  $.ajax({
    url: apiRequest,
    async: false,
    success: function(data) {
      if (data.kind === 'urlshortener#url' && data.longUrl && data.longUrl.indexOf('#') > -1) {
        normalizedUrl = data.longUrl.split('#')[1];
      }
    },
    error: function(jqxhr, textStatus) {
      var msg = 'Unable to inline Short URL "'+ shortUrl +'": ';
      logLady(msg + textStatus, jqxhr);
      notification('error', 'goo.gl API Error', msg + 'check error in JS console');
    }
  });

  return normalizedUrl;
}

function inlinePlaylistToken(urlMatch, token) {
  return urlMatch.replace('h='+token, decodeToken(token));
}

function minimizeImgurURL(urlMatch, host) {
  return urlMatch.replace(host, '');
}

function minimizeIpfsURL(urlMatch, host) {
  return urlMatch.replace(host, '');
}

function minimizeDirectURL(urlMatch, directUrl) {
  var googlRx = /https?:\/\/goo\.gl\//;
  if (googlRx.test(directUrl)) {
    return urlMatch.replace(googlRx, 'goo.gl/');
  }
  return urlMatch;
}

function urlForIntervalToken(token) {
  // fetch IPFS assets from the public gateway
  if (/^\/ip[fn]s\//.test(token)) {
    return 'https://ipfs.io' + token;
  }
  if (/^goo\.gl\//.test(token)) {
    return 'https://' + token;
  }

  return token;
}


function normalizeUrl(href, done) {
  var url    = href || window.location.href;
  var apiUrl = url;

  // fix URLs butchered by IM clients
  apiUrl = decodeURIComponent(apiUrl);

  // translate YouTube URL shenanigans (yes, this is redundant, but was broken in past..)
  apiUrl = apiUrl.replace('#t=','&t=');
  apiUrl = apiUrl.replace('/watch','/');

  // support legacy URLs
  apiUrl = apiUrl.replace(/[?#]|%23/g,'&').replace(/[&]/,'#');
  apiUrl = apiUrl.replace(/:([vit])=/g,'&$1=');
  apiUrl = apiUrl.replace(/[:&](shuffle|random)/,'&random');

  // fix time parameters
  apiUrl = apiUrl.replace(/([#&])t=(\w+)[:-](\w+)/g,'$1t=$2;$3');
  apiUrl = apiUrl.replace(/([#&])t=(\w+)[,](\w+)/g,'$1t=$2.$3');

  // inline playlists
  apiUrl = apiUrl.replace(/[#&]v=([^&]+)&list=([^&]+)&index=([^&]+)/g, deduplicateYTPlaylist);
  apiUrl = apiUrl.replace(/[#&]v=([^&]+)&index=([^&]+)&list=([^&]+)/g, function($0,$1,$2,$3){return deduplicateYTPlaylist($0,$1,$3,$2);});
  apiUrl = apiUrl.replace(/(#.+&|#)list=[^&]+&index=(\d+)/g, recalculateYTPlaylistIndex);
  apiUrl = apiUrl.replace(/(#.+&|#)index=(\d+)&list=[^&]+/g, recalculateYTPlaylistIndex);
  apiUrl = apiUrl.replace(/list=([^&:#]+)/g, inlineYTPlaylist);
  apiUrl = apiUrl.replace(/(https?:\/\/goo\.gl\/[^&#]+)/g, inlineShortenedPlaylist);

  // minimize URLs from known services
  apiUrl = apiUrl.replace(/(?:feature=[^&#]+[&#]|&feature=[^&#]+$)/,'');
  apiUrl = apiUrl.replace(/[#&]i=(https?:\/\/i\.imgur\.com\/)([^&]+)/g, minimizeImgurURL);
  apiUrl = apiUrl.replace(/[#&][iv]=(https?:\/\/ipfs\.io|(?:web\+)?fs:)(\/ip[fn]s\/[^&]+)/g, minimizeIpfsURL);
  apiUrl = apiUrl.replace(/[#&][iv]=(https?:\/\/[^&]+)/g, minimizeDirectURL);

  // hashed playlists
  apiUrl = apiUrl.replace(/[#&]h=([^&]+)/g, inlinePlaylistToken);

  if (_.isFunction(done)) {
    if (url != apiUrl) {
      document.location.replace(apiUrl);
    } else {
      done();
    }
  }

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
              .attr('href', 'https://cdn.jsdelivr.net/jquery.mcustomscrollbar/3.1.5/jquery.mCustomScrollbar.min.css');
            return 'https://cdn.jsdelivr.net/jquery.mcustomscrollbar/3.1.5/jquery.mCustomScrollbar.concat.min.js';
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

// Fix for IFrame-based players that steal focus and break keyboard shortcuts
// TODO: run this via interval, not event
function returnFocus() {
  //logLady('before returnFocus(): '+ document.activeElement.tagName + ' is focused');
  if(document.activeElement.tagName == 'IFRAME') {
    document.body.tabIndex = 1; // default is -1 (disabled focus)
    document.body.focus();
    //logLady('after returnFocus(): '+document.activeElement.tagName + ' is focused');
  }
}


function togglePanicOverlay() {
  var $overlay = $('#panicOverlay');

  if (!$overlay.is(':visible')) {
    // create overlay
    $overlay = $('<iframe src="https://duckduckgo.com/?q=parsing+error:+unmatched+0x42+in+unobtainium+loader+site%3Astackoverflow.com" id="panicOverlay"/>').appendTo('body');

    osd('Eek!');

    // keep focus in looper so that 'x' can go back
    $overlay.data('focusId', window.setInterval(returnFocus, 500));

    // set title to something else
    $overlay.data('oldTitle', $(document).find('title').text());
    $(document).prop('title', 'Search: parsing error…');
    changeFavicon('https://duckduckgo.com/favicon.ico');

    // other chores
    $('#box').hide();
    $('#help').hide();
    $('#editor').hide();

    if (Player.engine === YouTubePlayer && YT.PlayerState.PLAYING === YouTubePlayer.instance.getPlayerState()) {
      YouTubePlayer.instance.mute();
      YouTubePlayer.instance.pauseVideo();
    }
    else if (Player.engine === SoundCloudPlayer) {
      SoundCloudPlayer.instance.pause();
    }
    else if (Player.engine === HTML5Player) {
      HTML5Player.instance.pause();
    }
  } else {
    osd('kekeke');
    $('#box').show();
    changeFavicon(faviconPlay);
    $(document).prop('title', $overlay.data('oldTitle'));
    window.clearInterval($overlay.data('focusId'));
    $overlay.remove();

    if (Player.engine === YouTubePlayer && YT.PlayerState.PLAYING !== YouTubePlayer.instance.getPlayerState()) {
      YouTubePlayer.instance.unMute();
      YouTubePlayer.instance.playVideo();
    }
    else if (Player.engine === SoundCloudPlayer) {
      SoundCloudPlayer.instance.play();
    }
    else if (Player.engine === HTML5Player) {
      HTML5Player.instance.play();
    }
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
    if ($('#spinner').length === 0) {
      $('body').append($('<div id="spinner"></div>'));
    }
    changeFavicon(faviconWait);
    $('#box').css('background-image', 'linear-gradient(rgba(0,0,0,0.45),rgba(0,0,0,0.45)),url(' + imgUrl + ')');
  } else {
    $('#spinner').remove();
    $('#box').css('background-image', 'none');
  }
}

function getAutosize(size) {
  var $box = $('#box');
  // adjust #box size before animation to fix padding issues
  $box.css('max-width',  size.width);
  $box.css('max-height', size.height);

  $('#player').animate(_.pick(size, 'width', 'height'), AUTOSIZE_TIME);
}

// reloadable singleton! d8> ...kek wat? fuf! o_0
function YouTubePlayer() { // eslint-disable-line no-redeclare
  logLady('YouTubePlayer()');

  YouTubePlayer.newPlayer = function(playback) {
    var size = getPlayerSize(YouTubePlayer);

    setSplash('https://i.ytimg.com/vi/' + playback.videoId + '/default.jpg');

    YouTubePlayer.instance = new YT.Player('player',{
      height: size.height,
      width:  size.width,
      playerVars: {
        autoplay: '0',
        autohide: '1',
        html5: '1',
        iv_load_policy: '3',
        modestbranding: '1',
        showinfo: '0',
        disablekb: '0',
        enablejsapi: '1',
        origin: window.location.origin,
        rel: '0',
        theme: 'dark',
        color: 'white',
        fs: '0',
      },
      events: {
        onError: function(e) { logLady('YouTubePlayer error', e); },
        onReady: onYouTubePlayerReady,
        onStateChange: onYouTubePlayerStateChange
      }
    });


    YouTubePlayer.load = function(playback) {
      if (!_.isUndefined(YouTubePlayer.instance)) {
        logLady('Reusing existing YouTubePlayer for', playback);
        cueVideo(playback);
      } else {
        Player.newPlayer(playback);
      }
    };

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

    Player.speed = function(diff) {
      var ytApi = YouTubePlayer.instance;
      var current = ytApi.getPlaybackRate();
      if (ytApi && diff) {
        var availableRates = ytApi.getAvailablePlaybackRates();
        var newIndex = _.indexOf(availableRates, current) + 1*diff;
        if (newIndex >= 0 && newIndex < availableRates.length) {
          var newRate = availableRates[newIndex];
          ytApi.setPlaybackRate(newRate);
          return newRate;
        }
      }
      return current;
    };

    Player.autosize = _.compose(getAutosize, function(){return getPlayerSize(YouTubePlayer);});

    Player.autosize();
  };

  var cueVideo = function(playback) {
    $(document).prop('title', playback.videoId);
    var id = {
      'videoId':      playback.videoId,
      'startSeconds': playback.start,
      'endSeconds':   playback.end
    };
    YouTubePlayer.instance.cueVideoById(id);
  };

  var onYouTubePlayerReady = function(event) {
    logLady('onYouTubePlayerReady()');
    var quality = urlParam('quality');
    if (quality) {
      event.target.setPlaybackQuality(quality);
    }
    var speed = urlParam('speed');
    if (speed) {
      event.target.setPlaybackRate(speed);
    }
    var volume = urlParam('volume');
    if (volume) {
      event.target.setVolume(volume);
    }
    cueVideo(Playlist.current());
  };

  var playFromStart = function(player, video) {
    player.pauseVideo();
    player.seekTo(video.start, true);
    player.playVideo();
  };

  var onYouTubePlayerStateChange = function(event) {
    logLady('YouTube Player State Change', event.data);
    var current = Playlist.current();
    if (event.data == YT.PlayerState.CUED) {
      logLady('CUED', current);
      setSplash(null);
      if (isAutoplay()) {
        event.target.playVideo();
      }
    } else if (event.data == YT.PlayerState.ENDED) {
      logLady('ENDED', current);
      changeFavicon(faviconWait);
      if (event.target.getCurrentTime() >= current.end) {
        if (Playlist.multivideo) {
          Player.playNext();
        } else {
          playFromStart(event.target, current);
        }
      } else {
        // Sometimes YT player sends false-positive "ENDED" signal
        // just after item finished buffering, which causes premature
        // advancement to the next playlist item.
        // Workaround below reinitializes playback of impacted items.
        logLady('ENDED at', event.target.getCurrentTime());
        logLady('END was', current.end);
        logLady('Executing workaround for YT API bug');
        playFromStart(event.target, current);
      }
    } else if (event.data == YT.PlayerState.PLAYING) {
      logLady('PLAYING', current);
      $(document).prop('title', event.target.getVideoData().title);
      changeFavicon(faviconPlay);
      setSplash(null);
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

function ImagePlayer() { // eslint-disable-line no-redeclare
  logLady('ImagePlayer()');

  ImagePlayer.getImagePlayerSize = function(imgW, imgH) {
    var p = _.extend({}, getPlayerSize(ImagePlayer));
    var w = imgW * (p.height / imgH);
    var h = imgH * (p.width  / imgW);
    p.width  = Math.floor(Math.min(w, p.width));
    p.height = Math.floor(Math.min(h, p.height));
    return p;
  };

  ImagePlayer.setImagePlayerSize = function($player, w, h) {
    logLady('setImagePlayerSize(_,'+w+','+h+')');
    Player.autosize = _.compose(getAutosize, function(){return ImagePlayer.getImagePlayerSize(w, h);});
    Player.autosize();
  };

  ImagePlayer.startSlideshowTimerIfPresent = function ($player, playback) {
    if (Playlist.multivideo && playback.start > 0) {
      $player.on('destroyed', ImagePlayer.onImagePlayerRemove);
      ImagePlayer.timerId = _.delay(ImagePlayer.onImagePlayerStateChange, 1000*playback.start); // milis
    }
  };

  ImagePlayer.newPlayer = function(playback) {
    var $player = $('div#player');

    var imgUrl = urlForIntervalToken(playback.videoId);

    // smart splash screen
    $(document).prop('title', playback.videoId);
    $player.empty();
    // there is no thumbnail, just use background
    setSplash('/assets/zwartevilt.png');

    var showImage = function() {
      ImagePlayer.setImagePlayerSize($player, this.naturalWidth, this.naturalHeight);
      var image = this;
      var $image = $(image).height('100%').width('100%');
      $player.empty().append($image);

      $image.attr('src','');
      image.offsetHeight; // a hack to force redraw in Chrome to start cached .gif from the first frame
      $image.attr('src',imgUrl);

      setSplash(null);
      changeFavicon(faviconPlay);
      ImagePlayer.startSlideshowTimerIfPresent($player, playback);
    };
    var showError = function () {
      setSplash(null);
      notification('error', 'Unable to load URL:', '<code>' + imgUrl + '</code><p>Refresh page to try again</p>');
    };

    $('<img/>')
      .attr('src', imgUrl)
      .on('load',  showImage)
      .on('error', function() {
        $('<img/>')
          .attr('src', imgUrl)
          .on('load',  showImage)
          .on('error', showError);
      });

    Player.toggle = null;
  };

  ImagePlayer.onImagePlayerStateChange = function() {
    Player.newPlayer(Playlist.cycle());
  };

  ImagePlayer.onImagePlayerRemove = function() {
    window.clearTimeout(ImagePlayer.timerId);
  };
}

// reloadable singleton! d8> ...kek wat? fuf! o_0
function ImgurPlayer() { // eslint-disable-line no-redeclare
  logLady('ImgurPlayer()');

  if (!_.isFunction(ImagePlayer.setImagePlayerSize)) {
    ImagePlayer();
  }

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

    // smart splash screen
    $(document).prop('title', playback.videoId);
    $player.empty();
    // the smallest thumb with preserved aspect ratio has suffix 't'
    var thumbUrl = imgurUrl(playback.videoId.replace(/^([a-zA-Z0-9]+)/, '$1t'));
    setSplash(thumbUrl);

    // fetching image metadata (mainly to detect GIFs)
    var apiData = null;
    $.ajax({
      url: 'https://api.imgur.com/3/image/' + playback.videoId.replace(/\.\w+$/,''),
      headers: { 'Authorization': 'Client-ID ' + IMGUR_API_CLIENT_ID },
      async: false,
      success: function(data) {
        if (data.data) {
          apiData = data.data;
          ImagePlayer.setImagePlayerSize($player, apiData.width, apiData.height);
        }
        //logLady('Received Imgur MetaData', apiData);
      },
      error: function(jqxhr, textStatus) {
        logLady('Unable to get metadata about Imgur resource "'+playback.videoId+'" ('+ textStatus +'): ', jqxhr);
        // read ratio from thumbnail as a falback
        $('<img/>')
          .attr('src', thumbUrl)
          .on('load', function() {
            ImagePlayer.setImagePlayerSize($player, this.naturalWidth, this.naturalHeight);
          });
      }
    });

    var isGifvPossible = function(apiData) {
      return apiData
        && apiData.animated
        && !_.isUndefined(apiData.mp4)
        && apiData.mp4_size > 0;
    };

    if (isGifvPossible(apiData)) {
      logLady('GIFV detected, switching to HTML5 <video> player');

      var $gifv = $('<video id="gifv" width="100%" height="100%" poster="'+ thumbUrl + '" '
                + '         autoplay="autoplay" muted="muted" preload="auto" loop="loop">'
                + '<source src="'+ apiData.mp4.replace('http:','https:') +'" type="video/mp4">'
                + '</video>');
      $gifv.appendTo($player).bind('play', function() {
                    setSplash(null);
                    changeFavicon(faviconPlay);
                    ImagePlayer.startSlideshowTimerIfPresent($player, playback);
      });

    } else {
      var showImgur = function() {
        var image = this;
        var $image = $(image).height('100%').width('100%');
        $player.empty().append($image);

        /*
        $image.attr('src','');
        image.offsetHeight; // a hack to force redraw in Chrome to start cached .gif from the first frame
        $image.attr('src',imgUrl);
        */

        setSplash(null);
        changeFavicon(faviconPlay);
        ImagePlayer.startSlideshowTimerIfPresent($player, playback);
      };

      var hasSrcset = function(apiData) {
        return apiData && !(apiData.type === 'image/gif' && apiData.looping);
      };

      var buildImageTag = function(imgUrl, playback, apiData) {
        var $img = $('<img/>');
        if (hasSrcset(apiData)) {
          var img160px  = imgurUrl(playback.videoId.replace(/^([a-zA-Z0-9]+)/, '$1t'));
          var img320px  = imgurUrl(playback.videoId.replace(/^([a-zA-Z0-9]+)/, '$1m'));
          var img640px  = imgurUrl(playback.videoId.replace(/^([a-zA-Z0-9]+)/, '$1l'));
          var img1024px = imgurUrl(playback.videoId.replace(/^([a-zA-Z0-9]+)/, '$1h'));
          var origW     = ' ' + (apiData && apiData.width ? apiData.width : '2048') + 'w ';
          $img
            .attr('sizes', '80vw')
            .attr('srcset', img160px  + '  160w, ' +
              img320px  + '  320w, ' +
              img640px  + '  640w, ' +
              img1024px + ' 1024w, ' +
              imgUrl    +   origW    );
        }
        return $img.attr('src', imgUrl);
      };

      buildImageTag(imgUrl, playback, apiData)
        .on('load', showImgur)
        .on('error', function () {
          setSplash(null);
          notification('error', 'Unable to load URL:', '<code>' + imgUrl + '</code><p>Refresh page to try again</p>');
        });

    }

    Player.toggle = null;
  };

}

function SoundCloudPlayer() { // eslint-disable-line no-redeclare
  logLady('SoundCloudPlayer()');

  SoundCloudPlayer.newPlayer = function(playback) {
    $(document).prop('title', playback.videoId);
    setSplash('https://i.imgur.com/0Wyb16p.png');// no API, use static logo instead

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

    var scInit = _.once(function() {
      // run once, during first PLAY event
      // (workaround for SC API limitations)
      setSplash(null);
      $player.css('opacity', '1');
      sc.seekTo(1000*playback.start);
      sc.getCurrentSound(function (sound) {
        $(document).prop('title', sound.title);
      });
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
      scInit();
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

    Player.autosize = _.compose(getAutosize, function(){return getPlayerSize(SoundCloudPlayer);});
    Player.autosize();

  };

}


// reloadable singleton! d8> ...kek wat? fuf! o_0
function HTML5Player() { // eslint-disable-line no-redeclare
  logLady('HTML5Player()');

  var getHTML5PlayerSize = function() {
    var size = getPlayerSize(); // base size
    if (_(HTML5Player).has('videoWidth') && _(HTML5Player).has('videoHeight')
        && HTML5Player.videoWidth > 0 && HTML5Player.videoHeight > 0) {
      var w = Math.floor(HTML5Player.videoWidth  * (size.height / HTML5Player.videoHeight));
      var h = Math.floor(HTML5Player.videoHeight * (size.width  / HTML5Player.videoWidth));
      size.width  = Math.min(w, size.width);
      size.height = Math.min(h, size.height);
      logLady('Calculated HTML5PlayerSize with ratio fix: '+size.width+'x'+size.height);
    } else {
      // audio only -- set poster
      var canvas = document.createElement('canvas');
      _(canvas).extend(_.pick(size, 'width', 'height'));
      var ctx = canvas.getContext('2d');
      ctx.font = '100px sans-serif';
      ctx.fillStyle = '#555';
      ctx.fillText('🔊', 50, 100);
      ctx.font = '30px sans-serif';
      ctx.fillStyle = '#444';
      ctx.fillText(Playlist.current().videoId, 50, 150);
      ctx.fillText('(audio only)', 50, 250);
      $('#player video').attr('poster', canvas.toDataURL('image/png'));
    }
    return size;
  };
  Player.autosize = _.compose(getAutosize, getHTML5PlayerSize);


  HTML5Player.newPlayer = function(playback) {

    var handleVideoEnd = function(event) {
      if (Playlist.multivideo) {
        Player.playNext();
      } else {
        event.target.currentTime = playback.start;
        event.target.play();
      }
    };


    var timeSpec = playback.start  // can be null or 0 or >0
                 ? '#t=' + playback.start + (playback.end !== null ? ',' + playback.end : '')
                 : (playback.end !== null ? '#t=0,' + playback.end : '');

    var video = _.template(
      '<video id="video" width="100%" height="100%" '
    +   '<%= autoplay %> controls preload="<%= preload %>">'
    +   '<source src="<%= src %><%= time %>">'
    + '</video>'
    );

    var $player = $('div#player');

    var videoUrl = urlForIntervalToken(playback.videoId);
    var $video = $(video({    loop: Playlist.multivideo ? '' : 'loop',
                          autoplay: isAutoplay() ? 'autoplay' : '',
                           preload: isAutoplay() ? 'auto' : 'none',
                               src: videoUrl,
                              time: timeSpec })).appendTo($player);

    HTML5Player.instance = $video[0];

    $video
      .on('error', function() {
        setSplash(null);
        notification('error', 'Unable to load URL:',  '<code>' + videoUrl + '</code><p>Refresh page to try again</p>');
      })
      .on('loadstart', function(event) { // eslint-disable-line no-unused-vars
        // there is no thumbnail, just use background
        setSplash('/assets/zwartevilt.png');
        $(document).prop('title', playback.videoId);
        //logLady('event.' + event.type);
      })
      .on('loadeddata', function(event) {
        _(HTML5Player).extend(_.pick(event.target, 'videoWidth', 'videoHeight'));
        Player.autosize();
        //logLady('event.' + event.type);
      })
      .on('play', function(event) { // eslint-disable-line no-unused-vars
        setSplash(null);
        changeFavicon(faviconPlay);
        if (isEmbedded()) {
          isEmbedded.clickedPlay = true;
        }
        //logLady('event.' + event.type);
      })
      .on('pause', function(event) { // eslint-disable-line no-unused-vars
        //logLady('event.' + event.type);
      })
      .on('ended', function(event) {
        handleVideoEnd(event);
        //logLady('event.' + event.type);
      })
      .on('timeupdate', function(event) {
        // hackity hack, because 'ended' is not fired if playback has .end attribute
        if (playback.end !== null && event.target.currentTime >= playback.end) {
          handleVideoEnd(event);
        }
      })
      .on('volumechange', function(event) {
        cookieMonster('volume', event.target.volume);
        cookieMonster('muted', event.target.muted);
      })
      .on('click', function(event) {
        var clickY = (event.pageY - $(this).offset().top);
        var height = parseFloat($(this).height());
        if (clickY > 0.90*height) {
          // abort to avoid interference with controls
          return;
        }
        event.preventDefault(); // disable native handler (eg. Firefox)
        Player.toggle();
      });

    // we have to cache volume and (un)muted state ourselves...
    // using cookies here may seem weird, but this behavior is consistent with YouTube player! \:D/
    var initialVolume = cookieMonster('volume');
    if (initialVolume !== undefined) {
      HTML5Player.instance.volume = initialVolume;
    } else {
      cookieMonster('volume', HTML5Player.instance.volume);  // create if missing
    }
    var initiallyMuted = cookieMonster('muted');
    if (initiallyMuted !== undefined) {
      HTML5Player.instance.muted = initiallyMuted == 'true' ? true : false;  // :s
    } else {
      cookieMonster('muted', HTML5Player.instance.muted);  // create if missing
    }

  };

  Player.toggle = function() {
    if (HTML5Player.instance.paused) {
      HTML5Player.instance.play();
    } else {
      HTML5Player.instance.pause();
    }
  };

  Player.volume = function(diff) {
    var current = Math.floor(HTML5Player.instance.volume*100);
    if (diff) {
      var diffd = current + diff;
      var normalized = diffd < 0 ? 0 : diffd > 100 ? 100 : diffd;
      HTML5Player.instance.volume = normalized/100.0;
    } else {
      return current;
    }
  };

}


// reloadable singleton! d8> ...kek wat? fuf! o_0
function Player() { // eslint-disable-line no-redeclare
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

  Player.type = function (playback) {
    if (playback.urlKey === 'v' && isExternalURI(playback.videoId)) {
      return PLAYER_TYPES['V'];
    }
    if (playback.urlKey === 'i' && isExternalURI(playback.videoId)) {
      return PLAYER_TYPES['I'];
    }
    return PLAYER_TYPES[playback.urlKey];
  };

  Player.newPlayer = function(playback) {
    logLady('Player.newPlayer()', playback);
    $(document).prop('title', playback.videoId);

    var $box = $('#box');
    var $player = $('#player');
    if ($player.length) {
      $box.removeAttr('data-loaded-id');
      $player.remove();
    }

    if (_.isFunction(editorNotification)) editorNotification();

    var initPlayer = function() {
      $box.html('<div id="player"></div>');
      Player.engine();
      Player.engine.newPlayer(playback);
      $box.attr('data-loaded-id', playback.videoId);
    };

    var playerType = Player.type(playback);

    Player.engine = playerType.engine;
    var initApi   = playerType.api;
    if (_.isFunction(initApi)) {
      initApi(initPlayer);
    } else {
      initPlayer();
    }
  };

  Player.playNext = function() {
    changeFavicon(faviconWait);
    var prev = Playlist.current();
    var next = Playlist.cycle();
    var prevEngine = Player.type(prev).engine;
    var nextEngine = Player.type(next).engine;
    // reuse player engine when possible
    // https://github.com/lidel/yt-looper/issues/152
    if (prevEngine === nextEngine && _.isFunction(prevEngine.load)) {
      prevEngine.load(next);
      $('#box').attr('data-loaded-id', next.videoId);
      if (_.isFunction(editorNotification)) editorNotification();
    } else {
      Player.newPlayer(next);
    }
  };

  Player.fullscreenToggle = function() {
      if (!isFullscreen()) {
        var fs = $('body')[0];
        var requestFs = fs.requestFullscreen
          || fs.requestFullScreen
          || fs.mozRequestFullScreen
          || fs.webkitRequestFullScreen;
        if (requestFs) {
          requestFs.bind(fs)();
        }
      } else {
        var d = document;
        var cancelFs = d.exitFullscreen
          || d.cancelFullScreen
          || d.mozCancelFullScreen
          || d.webkitCancelFullScreen;
        if (cancelFs) {
          cancelFs.bind(d)();
        }
      }
      logLady('isFulscreen()=' +  isFullscreen());
  };

  Playlist(window.location.href);
  Playlist.log();

  Player.newPlayer(Playlist.current());
}


function initLooper() {
  logLady('initLooper()');
  if (isEmbedded()) {
    $('#box').addClass('embedded');
    $('#help').remove();
    $('#editor').remove();
    $('#menu').remove();
    $('body').append($('<a id="embed" href="'+ window.location.href +'" target="_blank">&#x21BB;</a>'));
  }
  Player();
  Editor(Playlist, Player);
  if (urlFlag('random')) {
    // Random mode should work from the start: https://github.com/lidel/yt-looper/issues/221
    Playlist.random();
  }
}

function onYouTubeIframeAPIReady() {
  logLady('onYouTubeIframeAPIReady()');
  if (_.isFunction(onYouTubeIframeAPIReady.callback)) onYouTubeIframeAPIReady.callback();
}

function renderPage() {
  var video = getVideo(window.location.href);
  logLady(video);
  var $box = $('#box').show();
  var $menu = $('#menu').show();

  // early splash screen if YouTube image is the first interval
  if (video.urlKey == 'v' && !isExternalURI(video.videoId)) {
    setSplash('https://i.ytimg.com/vi/' + video.videoId + '/default.jpg');
  }

  if (PLAYER_TYPES.hasOwnProperty(video.urlKey)) {
    initLooper();
  } else {
    // no valid hash, display #help
    changeFavicon();
    $(document).prop('title', 'yt-looper');
    $box.hide();
    $menu.hide();
    showHelpUi(true);
  }
}


// various init tasks on page load
(function($) {

  var onHashChange = function() {
    osd('URL Changed');
    // reset things that depend on URL
    $('#shortened').remove();
    $('#shorten').show();

    $('#embed-code').remove();
    $('#embed-toggle').show();

    $('#box').show();
    showHelpUi(false);

    // reset player or entire page
    var $player = $('#player');
    var hash = window.location.hash;
    if ($player.length > 0 && hash) {
      initLooper();
    } else {
      $player.remove();
      renderPage();
    }
  };


  $(window).bind('hashchange', function() {
    logLady('hash change: ' + window.location.hash);
    normalizeUrl(window.location.href, onHashChange);
  });


  // menu items will now commence!

  $('#shorten').click(showShortUrl);
  $('#embed-toggle').click(showEmbedCode);
  $('#help-toggle').click(function(){showHelpUi(!$('#help').is(':visible'));});

  // update player on window resize if autosize is enabled
  $(window).on('resize', _.throttle(function() {
    if (_.isFunction(Player.autosize)) {
      Player.autosize();
    }
  }, AUTOSIZE_TIME));

  // hide menu when in fullscreen
  $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange', function() {
    if (isFullscreen()) {
      $('#menu').hide();
      $('#box').addClass('embedded');
    } else {
      $('#box').removeClass('embedded');
      $('#menu').show();
    }
  });

  // keyboard shortcuts will now commence!
  $(document).unbind('keypress').keypress(function(e) {
    var k = (( typeof Editor === 'undefined'
            || _.isUndefined(Editor.editInProgress))
            && !isEmbedded() && !e.ctrlKey)
             ? String.fromCharCode(e.which).toLowerCase()
             : undefined;
    //logLady('key/code:'+k+'/'+e.which+'/ctrl:'+e.ctrlKey);
    if (k==='?') {
      $('#help-toggle').click();

    } else if (k==='e') {
      $('#editor-toggle').click();

    } else if (k==='s') {
      if (!$('#shortened').is(':visible')) {
        showShortUrl();
      }

    } else if (k==='f') {
      osd('Toggled fullscreen mode');
      Player.fullscreenToggle();

    } else if (k==='b') {
      osd('Toggled player visibility');
      $('#box').slideToggle();

    } else if (k==='x') {
      togglePanicOverlay();

    } else if (k==='r') {
      if (Playlist.intervals) {
        osd('Playing random interval');
        Player.newPlayer(Playlist.random());
      }
    } else if (k==='m') {
      switch(Player.engine) {
        case YouTubePlayer:
          if (YouTubePlayer.instance.isMuted()) {
            osd('Unmuted YouTube');
            YouTubePlayer.instance.unMute();
          } else {
            osd('Muted YouTube');
            YouTubePlayer.instance.mute();
          }
          break;
        case SoundCloudPlayer:
          // There is no video, so we pause instead
          osd('Toggled SoundCloud');
          SoundCloudPlayer.instance.toggle();
          break;
        case HTML5Player:
          if (HTML5Player.instance.muted) {
            osd('Unmuted HTML5Player');
            HTML5Player.instance.muted = false;
            cookieMonster('muted', false);
          } else {
            osd('Muted HTML5Player');
            HTML5Player.instance.muted = true;
            cookieMonster('muted', true);
          }
          break;
     }

    } else if (k==='+' || k==='=') {
      if (Player.volume) {
        osd('Volume +10%');
        Player.volume(+10);
      }

    } else if (k==='-' || k==='_') {
      if (Player.volume) {
        osd('Volume -10%');
        Player.volume(-10);
      }

    } else if (k===']' || k==='}') {
      if (Player.speed) {
        osd('Playback speed: &times;' + Player.speed(+1));
      }

    } else if (k==='[' || k==='{') {
      if (Player.speed) {
        osd('Playback speed: &times;' + Player.speed(-1));
      }

    } else if (k===' ') {
      if (Player.toggle) {
        osd('Toggled playback');
        Player.toggle();
      }

    } else if (Playlist.go) {
      var change = k==='k' ? Playlist.go('prevV')
                 : k==='j' ? Playlist.go('nextV')
                 : k==='h' ? Playlist.go('prevI')
                 : k==='l' ? Playlist.go('nextI')
                 : null;
      if (change) {
        osd('Jump!'); // TODO: display type of jump
        Player.newPlayer(change);
      }
    }
  });


  // enable dom element removal notification (because of reasons sic)
  $.event.special.destroyed = { remove: function(o){ if (o.handler) {o.handler();} } };

}(jQuery));

// vim:ts=2:sw=2:et:
