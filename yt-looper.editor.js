'use strict';

/* global Player, Playlist, GOOGLE_API_KEY, jackiechanMyIntervals */
/* global logLady */

// PROTOTYPES (fufuf jshitn!)
var _dropInterval,
    _gotoInterval,
    _editInterval,
    _linkInterval,
    _asyncVideoTitle,
    _updatePageAfterEditorEvent;


function _createEditorColumns(interval, index, $tr) {
  $tr
    .append($('<td/>',{ class: 'editor-col1' })
      .append(_dropInterval(interval, '&#10007;')))

    .append($('<td/>',{ class: 'editor-col2' })
      .append(_gotoInterval(interval, index)))

    .append($('<td/>',{ class: 'editor-col3' })
      .append(_editInterval(interval, index, '&#9998;')))

    .append($('<td/>',{ class: 'editor-col4' })
      .append(_linkInterval(interval, '&#10548;')));
}


function _humanReadableTime(interval) {
  var time = '';
  if (interval.start) {
    var start_h = Math.floor(interval.start / 3600);
    var start_m = Math.floor((interval.start % 3600) / 60);
    var start_s = (interval.start % 3600) % 60;
    time += (start_h ? start_h + 'h' : '')
         +  (start_m ? start_m + 'm' : '')
         +  (start_s ? start_s + 's' : '');
  }
  if (interval.end) {
    var end_h = Math.floor(interval.end / 3600);
    var end_m = Math.floor((interval.end % 3600) / 60);
    var end_s = (interval.end % 3600) % 60;
    time += ';'
         +  (end_h ? end_h + 'h' : '')
         +  (end_m ? end_m + 'm' : '')
         +  (end_s ? end_s + 's' : '');
  }
  return time ? '&t=' + time : '';
}

function _asyncVideoTitle(videoId, intervalLink) {

  var setTitle = function(title, intervalLink) {
      var intervalUri = intervalLink.text();
      intervalLink.addClass('truncate');
      intervalLink.attr('title', intervalUri);
      intervalLink.text(title);
  };

  var apiRequest = 'https://www.googleapis.com/youtube/v3/videos'
                  + '?part=snippet&id=' + videoId
                  + '&maxResults=1'
                  + '&fields=kind%2Citems%2Fsnippet(title)'
                  + '&key=' + GOOGLE_API_KEY;
  var retries = 3;
  $.ajax({ url: apiRequest, async: true}).done(function(data) {
    if (data.kind === 'youtube#videoListResponse' && data.items.length) {
      setTitle(data.items[0].snippet.title, intervalLink);
    }
  }).fail(function(jqxhr, textStatus) {
    logLady('Unable to get video title for id='+videoId+' ('+ textStatus +'): ', jqxhr);
    retries = retries - 1;
  });
}



function _assembleInterval(interval) {
  return interval.urlKey + '='
                         + interval.videoId
                         + _humanReadableTime(interval);
}


_dropInterval = function (interval, caption) {
  return $('<a/>').unbind().click(function () {
    $(this).parent('td')
           .parent('tr').remove();
    _updatePageAfterEditorEvent();
  }).append(caption);
};


_gotoInterval = function(interval, index) {
  var intervalLink = $('<a/>').unbind().click(function () {
    Playlist.index = index;
    Player.newPlayer(Playlist.current());
  }).append(_assembleInterval(interval));

  if (interval.urlKey === 'v') {
    _asyncVideoTitle(interval.videoId, intervalLink);
  }

  return intervalLink;
};


_editInterval = function (interval, index, caption) {
  return $('<a/>').unbind().click(function () {
    if (!_editInterval.editInProgress) {
      // only single edit is allowed at a time
      _editInterval.editInProgress = true;

      var $input = $('<input type="text"/>');
      $input.attr('value', _assembleInterval(interval));
      $input.width(Math.ceil($input.val().length/1.9) + 2 + 'em');

      $input.unbind().keypress(function (ev) {
        var key = ev.which;
        if (key == 13 || key == 27 || key == 9) { // enter || escape || tab
          var val = $(this).val();
          var $tr = $(this).parent('td')
                           .parent('tr').empty();

          var newInterval = jackiechanMyIntervals(val).intervals[0];

          // use original interval for failsafe
          _createEditorColumns(newInterval || interval, index, $tr);

          _editInterval.editInProgress = false;
          _updatePageAfterEditorEvent();
          return false;
        }
      });

      var $td = $('<td/>').attr('colspan', 4).html($input);
      $(this).parent('td')
             .parent('tr').html($td);
    }
  }).append(caption);
};


_linkInterval = function (interval, caption) {
  return $('<a/>', {
      href: '#' + _assembleInterval(interval),
    target: '_blank'
  }).append(caption || interval.videoId);
};


function _updateHighlight() {
  // unhighlight table multiple rows (just to be safe)
  $('#editor>table tr.highlighted').removeClass('highlighted');
  // highlight specific table row
  $('#editor>table tr:nth-child('+ (Playlist.index + 1) +')').addClass('highlighted');
}


_updatePageAfterEditorEvent = function () {
  if ($('#editor').length) {
    var href = '';
    var last = href;

    $('.editor-col2>a').each(function (index) {
      var $this = $(this);
      // reindex 'goto' links
      $this.unbind().click(function () {
        Playlist.index = index;
        Player.newPlayer(Playlist.current());
      });

      var text = $this.attr('title') || $this.text();
      var part = text.split('&');

      if (last === part[0] && part.length > 1) {
        // join time ranges
        var time = part[1].split('=')[1];
        if (time) {
          href += ('+' + time);
        }
      } else {
        // add full interval
        href += ('&' + text);
        last = part[0];
      }
    });

    document.location.replace('#' + href.substr(1));
  }
};


function _toggleEditor() {
  var $editor = $('#editor');

  if ($editor.length) {
    $editor.toggle('slide');

    $('#editor-ui').toggleClass('ticker');
    _updateHighlight(); // update on slide
  } else {
    $LAB
      // load only if editor has been requested
      .script('//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min.js')
      .wait(function () {
        var $editor = $('<div/>',{ id: 'editor' });
        var $table = $('<table/>');

        var $tbody = $('<tbody/>')
          .sortable({ update: _updatePageAfterEditorEvent })
          .disableSelection()
          .appendTo($table);

        _(Playlist.intervals).each(function (interval, index) {
          _createEditorColumns(interval, index, $('<tr/>').appendTo($tbody));
        });

        $table.appendTo($editor.hide());
        $editor
          .appendTo('body')
          .toggle('slide');

        $('#editor-ui').toggleClass('ticker');
        _updateHighlight(); // update on slide
      });
  }
}

function registerEditor() { // jshint ignore:line
  $('#editor-ui').unbind()
                 .click(_toggleEditor)
                 .show();

  Player.registerEditorNotification(_updateHighlight); // update on interval switch

  _updateHighlight(); // update on hash change
}


function unregisterEditor() { // jshint ignore:line
  Player.unregisterEditorNotification();

  var $editor = $('#editor');
  if ($editor.length) {
    $editor.unbind()
           .remove();
  }

  var $editor_ui = $('#editor-ui');
  if ($editor_ui.length) {
    $editor_ui.unbind()
              .removeClass('ticker')
              .hide();
  }
}

function reloadEditor() { // jshint ignore:line
  var $editor = $('#editor');
  if ($editor.length) {
    // TODO: https://github.com/lidel/yt-looper/issues/81#issuecomment-88258499
    unregisterEditor();
  }
}

// vim:ts=2:sw=2:et:
