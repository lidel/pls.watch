
function initYT(v) {

  $('#player').parent().css('background-image', 'url(//img.youtube.com/vi/' + v + '/0.jpg)')

  var tag = document.createElement('script');
  tag.src = "//www.youtube.com/iframe_api";

  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


}

function onYouTubeIframeAPIReady() {
  var player;
  player = new YT.Player('player', {
    width: '640',
    height: '390',
    videoId: urlParam('v'),

    playerVars: {
      'start': getSecs(getStart(urlParam('t'))),
      'end': getSecs(getEnd(urlParam('t'))),
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
  //console.log('event.data: ' + event.data);

  // no brakes on the loop train
  if (event.data == YT.PlayerState.ENDED || event.data == YT.PlayerState.PAUSED) {
    //console.log('event: ended/paused');
    jumpAndPlay(event.target, getSecs(getStart((urlParam('t')))));
    event.target.playVideo();
  }

}

function jumpAndPlay(target, time) {
  target.seekTo(time, true);
}

function onPlayerReady(event) {
  //console.log('onPlayerReady');
  $('#player').parent().css('background-image', 'none')
  $(document).prop('title', event.target.getVideoData().title);
  event.target.playVideo();
}

function urlParam(key) {
  var result = new RegExp(key + '=([^&]*)', 'i').exec(window.location.search);
  return result && unescape(result[1]) || '';
};

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
