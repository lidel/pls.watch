'use strict';

/* global GOOGLE_API_KEY, jackiechanMyIntervals, logLady, osd, urlFlag, urlParams, urlArgs, detectHTML5Video */


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
function Editor(Playlist, Player) { // eslint-disable-line no-unused-vars
  var _Playlist = Playlist; // these are singletons!
  var _Player = Player;     // but still we pass them in params to indicate dependency q:'V
                            // Mother, forgive us for what we have done

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
    $.ajax({
      url: apiRequest,
      async: true,
      success: function(data) {
        if (data.kind === 'youtube#videoListResponse' && data.items.length) {
          setTitle(data.items[0].snippet.title, intervalLink);
        }
      },
      error: function(jqxhr, textStatus) {
        logLady('Unable to get video title for id='+videoId+' ('+ textStatus +'): ', jqxhr);
        retries = retries - 1;
      }
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

    // Keep canonical URI of a single interval in data attribute
    intervalLink.attr('data-interval-uri', intervalLink.text());

    if (interval.urlKey === 'v' && !detectHTML5Video(interval.videoId)) {
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

      Editor.editInProgress = (function () { return; })();// kek'd safe undefined
      Editor.updateHash();
    };

    return $('<a/>').unbind().click(function () {
      if (Editor.editInProgress !== undefined) {
        saveIntervalItem(Editor.editInProgress);
      }

      var $input = $('<input type="text"/>');
      $input.attr('value', _assembleInterval(interval));

      // only single edit is allowed at a time
      Editor.editInProgress = $input;

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
    var $editor = $('#editor');
    // unhighlight multiple table rows (just to be safe)
    $('table tr.highlighted', $editor).removeClass('highlighted');
    // highlight specific table row
    var $highlight = $('table tr:nth-child('+ (Playlist.index + 1) +')', $editor).addClass('highlighted');
    if ($.mCustomScrollbar) {
      $editor.mCustomScrollbar('scrollTo',$highlight);
    }

  };

  Editor.updateHash = function () {
    logLady('Editor.updateHash()');
    var $editor = $('#editor');
    if ($editor.length) {
      var href = '';
      var last = href;
      var params = urlParams();

      $('.editor-col2>a', $editor).each(function (index) {
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


      document.location.replace('#' + href.substr(1) + urlArgs(params));
    }
  };

  Editor._renderRows = function ($tbody) {
    _(_Playlist.intervals).each(function (interval, index) {
      Editor._createRow(interval, index, $('<tr/>').appendTo($tbody));
    });
    Editor.updateHighlight();
  };

  Editor.create = _.once(function() {
    var $editor = $('<div/>', { id: 'editor' });
    var $table = $('<table/>');
    var $tbody = $('<tbody/>').sortable({ update: Editor.updateHash })
                              .appendTo($table);
    $table.appendTo($editor.hide());
    $editor.appendTo('body');
    Editor._renderRows($tbody);
  });

  Editor.reload = function () {
    logLady('Editor.reload()');

    var $editor = $('#editor');
    if ($editor.length > 0) {
      var $table = $('table', $editor).first();
      var $tbody = $('tbody', $table).first();
      $tbody.children('tr').remove();
      Editor._renderRows($tbody);
    }
  };

  Editor.show = function() {
    Editor.toggle(true);
  };


  Editor.toggle = function (show) {
    logLady('Editor.toggle()' + (show ? show : ''));

    var showGui = function() {
      $('#editor').show();
      $('#editor-ui').addClass('ticker');
    };

    var toggleGui = function() {
      osd('Toggled editor');
      $('#editor').toggle('slide');
      $('#editor-ui').toggleClass('ticker');
    };

    var $editor = $('#editor');
    if ($editor.length > 0) {
      if (show === true) {showGui();} else {toggleGui();}
    } else {
      $LAB
      // load jQuery UI if editor has been requested for the first time
      .script('https://cdn.jsdelivr.net/jquery.ui/1.11.4/jquery-ui.min.js')
      .wait(function () {
        Editor.create();
        $editor = $('#editor');
      })
      .script(function () {
        // load scrollbar assets only when it potentially makes sense
        if (Playlist.intervals.length > 10 && !$.mCustomScrollbar) {
          // Load CDN version of mCustomScrollbar by malihu (MIT)
          // http://manos.malihu.gr/jquery-custom-content-scroller/
          $('<link>')
            .appendTo('head')
            .attr({type : 'text/css', rel : 'stylesheet'})
            .attr('href', 'https://cdn.jsdelivr.net/jquery.mcustomscrollbar/3.1.1/jquery.mCustomScrollbar.min.css');
          return 'https://cdn.jsdelivr.net/jquery.mcustomscrollbar/3.1.1/jquery.mCustomScrollbar.concat.min.js';
        } else {
          return null;
        }
      })
      .wait(function() {
        if ($.mCustomScrollbar && !$editor.hasClass('mCustomScrollbar')) {
          $editor.mCustomScrollbar({
            axis: 'y',
            mouseWheel: { axis: 'y' },
            scrollInertia: 0,
            theme: 'minimal'
          }).css('padding-right','16px');
        }
        Editor.updateHighlight();
        if (show === true) {showGui();} else {toggleGui();}
      });
    }
  };

  Editor.register = function () {
    logLady('Editor.register()');
    $('#editor-toggle').unbind().click(Editor.toggle);
    _Player.registerEditorNotification(Editor.updateHighlight); // update on interval switch

    Editor.reload(); // update on hash change

    // show editor if requested via URL
    if (urlFlag('editor')) {
      Editor.show();
    }

  };

  Editor.register();
}


// vim:ts=2:sw=2:et:
