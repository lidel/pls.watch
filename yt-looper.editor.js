'use strict';

/* global GOOGLE_API_KEY, jackiechanMyIntervals, logLady */


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


function _assembleInterval(interval) {
  return interval.urlKey + '='
                         + interval.videoId
                         + _humanReadableTime(interval);
}

// reloadable singleton! d8> ...kek wat? fuf! o_0
function Editor(Playlist, Player) { /*jshint ignore:line*/
  var _Playlist = Playlist; // these are singletons!
  var _Player = Player;     // but still we pass them in params to indicate dependency q:'V

  Editor._createAsyncVideoTitle = function (videoId, intervalLink) {
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
    $.ajax({ url: apiRequest, async: true }).done(function(data) {
      if (data.kind === 'youtube#videoListResponse' && data.items.length) {
        setTitle(data.items[0].snippet.title, intervalLink);
      }
    }).fail(function(jqxhr, textStatus) {
      logLady('Unable to get video title for id='+videoId+' ('+ textStatus +'): ', jqxhr);
      retries = retries - 1;
    });
  };

  Editor._createDrop = function (interval, caption) {
    return $('<a/>').unbind().click(function () {
      $(this).parent('td').parent('tr').remove();
      Editor.updateHash();
    }).append(caption);
  };

  Editor._createGoto = function(interval, index) {
    var intervalLink = $('<a/>').unbind().click(function () {
      _Playlist.index = index;
      _Player.newPlayer(_Playlist.current());
    }).append(_assembleInterval(interval));

    if (interval.urlKey === 'v') {
      Editor._createAsyncVideoTitle(interval.videoId, intervalLink);
    }

    return intervalLink;
  };

  Editor._createEdit = function (interval, index, caption) {
    var saveIntervalItem = function ($input) {
      var val = $input.val();
      var $tr = $input.parent('td').parent('tr').empty();
      var newInterval = jackiechanMyIntervals(val).intervals[0];

      // use original interval for failsafe
      Editor._createRow(newInterval || interval, index, $tr);

      Editor._createEdit.editInProgress = (function () { return; })();// kek'd safe undefined
      Editor.updateHash();
    };

    return $('<a/>').unbind().click(function () {
      var inProgress = Editor._createEdit.editInProgress;
      if (inProgress !== undefined) {
        saveIntervalItem(inProgress);
      }

      var $input = $('<input type="text"/>');
      $input.attr('value', _assembleInterval(interval));

      // only single edit is allowed at a time
      Editor._createEdit.editInProgress = $input;

      $input.unbind().keypress(function (ev) {
        var key = ev.keyCode ? ev.keyCode : ev.which;
        logLady(key);
        if (key == 13 || key == 27 || key == 9) { // enter || escape || tab
          saveIntervalItem($input);
          return false;
        }
      });
      $input.focusout(function() {
        saveIntervalItem($input);
      });

      var $td1 = $('<td/>').addClass('editor-col1').html('&#9998;');
      var $td2 = $('<td/>').attr('colspan', 3).html($input);
      var $tr = $(this).parent('td').parent('tr');
      $tr.html($td2).prepend($td1);

      // set focus to input and move cursor to its end
      var inputVal = $input.focus().val();
      $input.val('').val(inputVal);

    }).append(caption);
  };

  Editor._createLink = function (interval, caption) {
    return $('<a/>', {
        href: '#' + _assembleInterval(interval),
      target: '_blank'
    }).append(caption || interval.videoId);
  };

  Editor._createRow = function (interval, index, $tr) {
    $tr
      .append($('<td/>',{ class: 'editor-col1' })
        .append(Editor._createDrop(interval, '&#10007;'))) // x

      .append($('<td/>',{ class: 'editor-col2' })
        .append(Editor._createGoto(interval, index)))

      .append($('<td/>',{ class: 'editor-col3' })
        .append(Editor._createEdit(interval, index, '&#9998;'))) // pencil

      .append($('<td/>',{ class: 'editor-col4' })
        .append(Editor._createLink(interval, '&#10548;'))); // arrow
  };

  Editor.updateHighlight = function () {
    logLady('Editor.updateHighlight()');
    // unhighlight multiple table rows (just to be safe)
    $('#editor>table tr.highlighted').removeClass('highlighted');
    // highlight specific table row
    $('#editor>table tr:nth-child('+ (Playlist.index + 1) +')').addClass('highlighted');
  };

  Editor.updateHash = function () {
    logLady('Editor.updateHash()');
    if ($('#editor').length) {
      var href = '';
      var last = href;

      $('.editor-col2>a').each(function (index) {
        var $this = $(this); // such optimization! c/\o
        // reindex 'goto' links
        $this.unbind().click(function () {
          _Playlist.index = index;
          _Player.newPlayer(_Playlist.current());
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

  Editor._renderRows = function ($tbody) {
    _(_Playlist.intervals).each(function (interval, index) {
      Editor._createRow(interval, index, $('<tr/>').appendTo($tbody));
    });
    Editor.updateHighlight();
  };

  Editor.create = function () {
    var $editor = $('<div/>', { id: 'editor' });
    var $table = $('<table/>');
    var $tbody = $('<tbody/>').sortable({ update: Editor.updateHash })
                              .appendTo($table);
    $table.appendTo($editor.hide());
    $editor.appendTo('body');
    Editor._renderRows($tbody);
  };

  Editor.reload = function () {
    logLady('Editor.reload()');
 
    var $editor = $('#editor');
    if ($editor.length > 0) {
      var $table = $editor.children('table').first();
      var $tbody = $table.children('tbody').first();
      $tbody.children('tr').remove();
      Editor._renderRows($tbody);
    }
  };

  Editor.toggle = function () {
    var $editor = $('#editor');
    if ($editor.length > 0) {
      $editor.toggle('slide');
      $('#editor-ui').toggleClass('ticker');
      Editor.updateHighlight(); // update on slide
    } else {
      $LAB
      // load only if editor has been requested
      .script('//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min.js')
      .wait(function () {
        Editor.create();
        $('#editor').toggle('slide');
        $('#editor-ui').toggleClass('ticker');
      });
    }
  };

  Editor.register = function () {
    logLady('Editor.register()');
    $('#editor-ui').unbind()
                   .click(Editor.toggle)
                   .show();

    _Player.registerEditorNotification(Editor.updateHighlight); // update on interval switch

    Editor.reload(); // update on hash change
  };

/*
  Editor.unregister = function () {
    _Player.unregisterEditorNotification();

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
  };
*/

  Editor.register();
}


// vim:ts=2:sw=2:et:
