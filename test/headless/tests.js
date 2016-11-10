'use strict';
/* global QUnit, recalculateYTPlaylistIndex, normalizeUrl, jackiechanMyIntervals, isExternalURI */
/* global Playlist, parseIntervals, getParam, parseVideos, inlineYTPlaylist */
/* global encodeToken, decodeToken, urlFlag */

QUnit.test('qunit self-test', function (assert) {
  assert.ok(1 == '1', 'Passed!');
});

QUnit.module('Basic URL parsing');

QUnit.test('one video, one interval', function (assert) {
  var url = 'http://yt.aergia.eu/#v=T0rs3R4E1Sk:t=23;30';
  var urls = [url, url.replace(':','&')];
  var expected_intervals = [{start:23,end:30}];

  _(urls).chain().map(normalizeUrl).each(function (test_url, i) {
    var videos = parseVideos(test_url);
    assert.ok(videos.length == 1, 'incorrect number of detected videos for test_url #' + i);
    test_url = videos[0];

    assert.deepEqual(getParam(test_url, 'v'), 'T0rs3R4E1Sk', 'incorrect video id for test_url #' + i);
    assert.deepEqual(getParam(test_url, 't'), '23;30', 'incorrect interval data for test_url #' + i);
    assert.deepEqual(parseIntervals(test_url, 't'), expected_intervals, 'incorrect parseIntervals result for test_url #' + i);
  });

});

QUnit.test('one video, multiple intervals', function (assert) {
  var url = 'http://yt.aergia.eu/#v=ZNno63ZO2Lw:t=54s;1m20s+1m33s;1m47s+3m30s;3m46s';
  var urls = [url, url.replace(':','&')];
  var expected_intervals = [{start:54,end:80}, {start:93,end:107}, {start:210,end:226}];

  _(urls).chain().map(normalizeUrl).each(function (test_url, i) {
    var videos = parseVideos(test_url);
    assert.ok(videos.length == 1, 'incorrect number of detected videos');
    test_url = videos[0];

    assert.deepEqual(getParam(test_url, 'v'), 'ZNno63ZO2Lw', 'incorrect video id for test_url #' + i);
    assert.deepEqual(getParam(test_url, 't'), '54s;1m20s+1m33s;1m47s+3m30s;3m46s', 'incorrect interval data for test_url #' + i);
    assert.deepEqual(parseIntervals(test_url, 't'), expected_intervals, 'incorrect parseIntervals result for test_url #' + i);
  });
});

QUnit.module('Advanced URL parsing');

QUnit.test('two videos, mixed intervals', function (assert) {
  var url = 'http://yt.aergia.eu/#v=ZNno63ZO2Lw:t=54;1m20s+1m33s;1m47s+3m30s;3m46s:v=TM1Jy3qPSCQ:t=2;16s';
  var urls = [url, url.replace(':','&')];
  var expected_intervals;

  _(urls).chain().map(normalizeUrl).each(function (test_url, i) {
    var videos = parseVideos(test_url);
    assert.ok(videos.length == 2, 'incorrect number of detected videos');

    test_url = videos[0];
    expected_intervals = [{start:54,end:80}, {start:93,end:107}, {start:210,end:226}];
    assert.deepEqual(getParam(test_url, 'v'), 'ZNno63ZO2Lw', 'incorrect video id for test_url #' + i);
    assert.deepEqual(getParam(test_url, 't'), '54;1m20s+1m33s;1m47s+3m30s;3m46s', 'incorrect interval data for test_url #' + i);
    assert.deepEqual(parseIntervals(test_url, 't'), expected_intervals, 'incorrect parseIntervals result for test_url #' + i);


    test_url = videos[1];
    expected_intervals = [{start:2,end:16}];
    assert.deepEqual(getParam(test_url, 'v'), 'TM1Jy3qPSCQ', 'incorrect video id for test_url #' + i);
    assert.deepEqual(getParam(test_url, 't'), '2;16s', 'incorrect interval data for test_url #' + i);
    assert.deepEqual(parseIntervals(test_url, 't'), expected_intervals, 'incorrect parseIntervals result for test_url #' + i);
  });

});

QUnit.test('External URI detection', function (assert) {
  var tests = [
    {expect: true,  href: '#v=http://xyz.org/abcdefg.mp4'        },
    {expect: true,  href: '#v=https://xyz.org/abcdefg.mp4'       },
    {expect: false, href: '#v=xyz.org/abcdefg.mp4'               },
    {expect: true,  href: '#v=http://xyz.org/abcdefg.mp4&t=;5s'  },
    {expect: true,  href: '#v=https://xyz.org/abcdefg.mp4&t=;5s' },
    {expect: false, href: '#v=xyz.org/abcdefg.mp4&t=;5s'         },

    {expect: true,  href: '#v=http://xyz.org/abcdefg.ogg'        },
    {expect: true,  href: '#v=https://xyz.org/abcdefg.ogg'       },
    {expect: false, href: '#v=xyz.org/abcdefg.ogg'               },
    {expect: true,  href: '#v=http://xyz.org/abcdefg.ogg&t=;5s'  },
    {expect: true,  href: '#v=https://xyz.org/abcdefg.ogg&t=;5s' },
    {expect: false, href: '#v=xyz.org/abcdefg.ogg&t=;5s'         },

    {expect: true,  href: '#v=http://xyz.org/abcdefg.webm'       },
    {expect: true,  href: '#v=https://xyz.org/abcdefg.webm'      },
    {expect: false, href: '#v=xyz.org/abcdefg.webm'              },
    {expect: true,  href: '#v=http://xyz.org/abcdefg.webm&t=;5s' },
    {expect: true,  href: '#v=https://xyz.org/abcdefg.webm&t=;5s'},
    {expect: false, href: '#v=xyz.org/abcdefg.webm&t=;5s'        },

    {expect: true,  href: '#i=http://xyz.org/abcdefg.jpg'        },
    {expect: true,  href: '#i=https://xyz.org/abcdefg.jpg'       },
    {expect: false, href: '#i=xyz.org/abcdefg.jpg'               },
    {expect: true,  href: '#i=http://xyz.org/abcdefg.jpg&t=5s'   },
    {expect: true,  href: '#i=https://xyz.org/abcdefg.jpg&t=5s'  },
    {expect: false, href: '#i=xyz.org/abcdefg.jpg&t=5s'          },

    {expect: true,  href: '#i=http://xyz.org/abcdefg.gif'        },
    {expect: true,  href: '#i=https://xyz.org/abcdefg.gif'       },
    {expect: false, href: '#i=xyz.org/abcdefg.gif'               },
    {expect: true,  href: '#i=http://xyz.org/abcdefg.gif&t=5s'   },
    {expect: true,  href: '#i=https://xyz.org/abcdefg.gif&t=5s'  },
    {expect: false, href: '#i=xyz.org/abcdefg.gif&t=5s'          },

    {expect: true,  href: '#i=http://xyz.org/abcdefg'            },
    {expect: true,  href: '#i=https://xyz.org/abcdefg'           },
    {expect: false, href: '#i=xyz.org/abcdefg'                   },
    {expect: true,  href: '#i=http://xyz.org/abcdefg&t=5s'       },
    {expect: true,  href: '#i=https://xyz.org/abcdefg&t=5s'      },
    {expect: false, href: '#i=xyz.org/abcdefgt=5s'               },

    {expect: true,  href: '#v=/ipns/some/path.webm'              },
    {expect: true,  href: '#v=/ipfs/QmYHNYAaYK5hm3ZhZFx5W9H6xydKDGimjdgJMrMSdnctEm' },
    {expect: true,  href: '#i=/ipns/some/path.webm'              },
    {expect: true,  href: '#i=/ipfs/QmYHNYAaYK5hm3ZhZFx5W9H6xydKDGimjdgJMrMSdnctEm' }
  ];

  _(tests).each(function(test) {
    var videoId = jackiechanMyIntervals(test.href).intervals[0].videoId;
    assert.ok(test.expect ?  isExternalURI(videoId)
                          : !isExternalURI(videoId), test.href);
  });

});

QUnit.test('YT video + HTML5 video + IG image + HTML5 video: intervals', function (assert) {
  var url = normalizeUrl(
    'https://yt.aergia.eu/'
  + '#v=HMMofOPRo7A&t=20s;29s'
  + '&v=https://vt.tumblr.com/tumblr_npa1dkYP1U1urdxm4.mp4&t=1s;3s'
  + '&i=8Fy3db9&t=2s'
  + '&v=https://vt.tumblr.com/tumblr_npa1dkYP1U1urdxm4.mp4&t=2s;4s'
  );

  var expected_intervals = [
    {urlKey:'v', videoId:'HMMofOPRo7A',                                        start:20,end:29  , prevI:0,nextI:0, prevV:3,nextV:1},
    {urlKey:'v', videoId:'https://vt.tumblr.com/tumblr_npa1dkYP1U1urdxm4.mp4', start:1 ,end:3   , prevI:1,nextI:1, prevV:0,nextV:2},
    {urlKey:'i', videoId:'8Fy3db9'                                           , start:2 ,end:null, prevI:2,nextI:2, prevV:1,nextV:3},
    {urlKey:'v', videoId:'https://vt.tumblr.com/tumblr_npa1dkYP1U1urdxm4.mp4', start:2 ,end:4   , prevI:3,nextI:3, prevV:2,nextV:0}
  ];

  var generated = jackiechanMyIntervals(url);

  assert.deepEqual(expected_intervals, generated.intervals, 'regression');
});


QUnit.module('Advanced interval indexing');

QUnit.test('schemes: 0 ; 0 0 ; 0 0 0', function (assert) {
  var hrefs = ['v=abcdefghij0',
               'v=abcdefghij0:v=abcdefghij1',
               'v=abcdefghij0:v=abcdefghij1:v=abcdefghij2'];

  var expected_intervals = [
    [{urlKey:'v', videoId:'abcdefghij0', start:0,end:null, prevI:0,nextI:0, prevV:0,nextV:0}],

    [{urlKey:'v', videoId:'abcdefghij0', start:0,end:null, prevI:0,nextI:0, prevV:1,nextV:1},
     {urlKey:'v', videoId:'abcdefghij1', start:0,end:null, prevI:1,nextI:1, prevV:0,nextV:0}],

    [{urlKey:'v', videoId:'abcdefghij0', start:0,end:null, prevI:0,nextI:0, prevV:2,nextV:1},
     {urlKey:'v', videoId:'abcdefghij1', start:0,end:null, prevI:1,nextI:1, prevV:0,nextV:2},
     {urlKey:'v', videoId:'abcdefghij2', start:0,end:null, prevI:2,nextI:2, prevV:1,nextV:0}],
  ];

  _(hrefs).chain().map(normalizeUrl).zip(expected_intervals).each(function (tuple, i) {
    var generated = jackiechanMyIntervals(tuple[0]);
    assert.deepEqual(generated.intervals, tuple[1], 'incorrect intervals for input #' + i);
  });
});

QUnit.test('schemes: 1 ; 1 0 ; 1 0 0', function (assert) {
  var hrefs = ['v=abcdefghij0:t=1s;2s',
               'v=abcdefghij0:t=1s;2s:v=abcdefghij1',
               'v=abcdefghij0:t=1s;2s:v=abcdefghij1:v=abcdefghij2'];

  var expected_intervals = [
    [{urlKey:'v', videoId:'abcdefghij0', start:1,end:2, prevI:0,nextI:0, prevV:0,nextV:0}],

    [{urlKey:'v', videoId:'abcdefghij0', start:1,end:   2, prevI:0,nextI:0, prevV:1,nextV:1},
     {urlKey:'v', videoId:'abcdefghij1', start:0,end:null, prevI:1,nextI:1, prevV:0,nextV:0}],

    [{urlKey:'v', videoId:'abcdefghij0', start:1,end:   2, prevI:0,nextI:0, prevV:2,nextV:1},
     {urlKey:'v', videoId:'abcdefghij1', start:0,end:null, prevI:1,nextI:1, prevV:0,nextV:2},
     {urlKey:'v', videoId:'abcdefghij2', start:0,end:null, prevI:2,nextI:2, prevV:1,nextV:0}],
  ];

  _(hrefs).chain().map(normalizeUrl).zip(expected_intervals).each(function (tuple, i) {
    var generated = jackiechanMyIntervals(tuple[0]);
    assert.deepEqual(generated.intervals, tuple[1], 'incorrect intervals for input #' + i);
  });
});

QUnit.test('schemes: 2 ; 2 0 ; 2 0 0', function (assert) {
  var hrefs = ['v=abcdefghij0:t=1s;2s+3s;4s',
               'v=abcdefghij0:t=1s;2s+3s;4s:v=abcdefghij1',
               'v=abcdefghij0:t=1s;2s+3s;4s:v=abcdefghij1:v=abcdefghij2'];

  var expected_intervals = [
    [{urlKey:'v', videoId:'abcdefghij0', start:1,end:2, prevI:1,nextI:1, prevV:0,nextV:0},
     {urlKey:'v', videoId:'abcdefghij0', start:3,end:4, prevI:0,nextI:0, prevV:0,nextV:0}],

    [{urlKey:'v', videoId:'abcdefghij0', start:1,end:   2, prevI:1,nextI:1, prevV:2,nextV:2},
     {urlKey:'v', videoId:'abcdefghij0', start:3,end:   4, prevI:0,nextI:0, prevV:2,nextV:2},
     {urlKey:'v', videoId:'abcdefghij1', start:0,end:null, prevI:2,nextI:2, prevV:0,nextV:0}],

    [{urlKey:'v', videoId:'abcdefghij0', start:1,end:   2, prevI:1,nextI:1, prevV:3,nextV:2},
     {urlKey:'v', videoId:'abcdefghij0', start:3,end:   4, prevI:0,nextI:0, prevV:3,nextV:2},
     {urlKey:'v', videoId:'abcdefghij1', start:0,end:null, prevI:2,nextI:2, prevV:0,nextV:3},
     {urlKey:'v', videoId:'abcdefghij2', start:0,end:null, prevI:3,nextI:3, prevV:2,nextV:0}],
  ];

  _(hrefs).chain().map(normalizeUrl).zip(expected_intervals).each(function (tuple, i) {
    var generated = jackiechanMyIntervals(tuple[0]);
    assert.deepEqual(generated.intervals, tuple[1], 'incorrect intervals for input #' + i);
  });
});

QUnit.test('schemes: 3 ; 3 2 ; 3 2 1', function (assert) {
  var hrefs = ['v=abcdefghij0:t=1s;2s+3s;4s+5s;6s',
               'v=abcdefghij0:t=1s;2s+3s;4s+5s;6s:v=abcdefghij1:t=7s;8s+9s;10s',
               'v=abcdefghij0:t=1s;2s+3s;4s+5s;6s:v=abcdefghij1:t=7s;8s+9s;10s:v=abcdefghij2:t=11s;12s'];

  var expected_intervals = [
    [{urlKey:'v', videoId:'abcdefghij0', start:1,end:2, prevI:2,nextI:1, prevV:0,nextV:0},
     {urlKey:'v', videoId:'abcdefghij0', start:3,end:4, prevI:0,nextI:2, prevV:0,nextV:0},
     {urlKey:'v', videoId:'abcdefghij0', start:5,end:6, prevI:1,nextI:0, prevV:0,nextV:0}],

    [{urlKey:'v', videoId:'abcdefghij0', start:1,end: 2, prevI:2,nextI:1, prevV:3,nextV:3},
     {urlKey:'v', videoId:'abcdefghij0', start:3,end: 4, prevI:0,nextI:2, prevV:3,nextV:3},
     {urlKey:'v', videoId:'abcdefghij0', start:5,end: 6, prevI:1,nextI:0, prevV:3,nextV:3},
     {urlKey:'v', videoId:'abcdefghij1', start:7,end: 8, prevI:4,nextI:4, prevV:0,nextV:0},
     {urlKey:'v', videoId:'abcdefghij1', start:9,end:10, prevI:3,nextI:3, prevV:0,nextV:0}],

    [{urlKey:'v', videoId:'abcdefghij0', start: 1,end: 2, prevI:2,nextI:1, prevV:5,nextV:3},
     {urlKey:'v', videoId:'abcdefghij0', start: 3,end: 4, prevI:0,nextI:2, prevV:5,nextV:3},
     {urlKey:'v', videoId:'abcdefghij0', start: 5,end: 6, prevI:1,nextI:0, prevV:5,nextV:3},
     {urlKey:'v', videoId:'abcdefghij1', start: 7,end: 8, prevI:4,nextI:4, prevV:0,nextV:5},
     {urlKey:'v', videoId:'abcdefghij1', start: 9,end:10, prevI:3,nextI:3, prevV:0,nextV:5},
     {urlKey:'v', videoId:'abcdefghij2', start:11,end:12, prevI:5,nextI:5, prevV:3,nextV:0}],
  ];

  _(hrefs).chain().map(normalizeUrl).zip(expected_intervals).each(function (tuple, i) {
    var generated = jackiechanMyIntervals(tuple[0]);
    assert.deepEqual(generated.intervals, tuple[1], 'incorrect intervals for input #' + i);
  });
});

QUnit.module('Basic playlist directions');

QUnit.test('scheme: 3 2 1 : +I +I +I +I -V -I +V +V +V +V -I +I -V -V -V -V -V -I -I -I +V', function (assert) {
  var href = '#v=abcdefghij0:t=1s;2s+3s;4s+5s;6s:v=abcdefghij1:t=7s;8s+9s;10s:v=abcdefghij2:t=11s;12s';

  new Playlist(normalizeUrl(href));

  var steps = [
    ['nextI', {urlKey:'v', videoId:'abcdefghij0', start: 3,end: 4, prevI:0,nextI:2, prevV:5,nextV:3} ], // 0
    ['nextI', {urlKey:'v', videoId:'abcdefghij0', start: 5,end: 6, prevI:1,nextI:0, prevV:5,nextV:3} ], // 1
    ['nextI', {urlKey:'v', videoId:'abcdefghij0', start: 1,end: 2, prevI:2,nextI:1, prevV:5,nextV:3} ], // 2
    ['nextI', {urlKey:'v', videoId:'abcdefghij0', start: 3,end: 4, prevI:0,nextI:2, prevV:5,nextV:3} ], // 3
    ['prevV', {urlKey:'v', videoId:'abcdefghij2', start:11,end:12, prevI:5,nextI:5, prevV:3,nextV:0} ], // 4
    ['prevI', {urlKey:'v', videoId:'abcdefghij2', start:11,end:12, prevI:5,nextI:5, prevV:3,nextV:0} ], // 5
    ['nextV', {urlKey:'v', videoId:'abcdefghij0', start: 1,end: 2, prevI:2,nextI:1, prevV:5,nextV:3} ], // 6
    ['nextV', {urlKey:'v', videoId:'abcdefghij1', start: 7,end: 8, prevI:4,nextI:4, prevV:0,nextV:5} ], // 7
    ['nextV', {urlKey:'v', videoId:'abcdefghij2', start:11,end:12, prevI:5,nextI:5, prevV:3,nextV:0} ], // 8
    ['nextV', {urlKey:'v', videoId:'abcdefghij0', start: 1,end: 2, prevI:2,nextI:1, prevV:5,nextV:3} ], // 9
    ['prevI', {urlKey:'v', videoId:'abcdefghij0', start: 5,end: 6, prevI:1,nextI:0, prevV:5,nextV:3} ], // 10
    ['nextI', {urlKey:'v', videoId:'abcdefghij0', start: 1,end: 2, prevI:2,nextI:1, prevV:5,nextV:3} ], // 11
    ['prevV', {urlKey:'v', videoId:'abcdefghij2', start:11,end:12, prevI:5,nextI:5, prevV:3,nextV:0} ], // 12
    ['prevV', {urlKey:'v', videoId:'abcdefghij1', start: 7,end: 8, prevI:4,nextI:4, prevV:0,nextV:5} ], // 13
    ['prevV', {urlKey:'v', videoId:'abcdefghij0', start: 1,end: 2, prevI:2,nextI:1, prevV:5,nextV:3} ], // 14
    ['prevV', {urlKey:'v', videoId:'abcdefghij2', start:11,end:12, prevI:5,nextI:5, prevV:3,nextV:0} ], // 15
    ['prevV', {urlKey:'v', videoId:'abcdefghij1', start: 7,end: 8, prevI:4,nextI:4, prevV:0,nextV:5} ], // 16
    ['prevI', {urlKey:'v', videoId:'abcdefghij1', start: 9,end:10, prevI:3,nextI:3, prevV:0,nextV:5} ], // 17
    ['prevI', {urlKey:'v', videoId:'abcdefghij1', start: 7,end: 8, prevI:4,nextI:4, prevV:0,nextV:5} ], // 18
    ['prevI', {urlKey:'v', videoId:'abcdefghij1', start: 9,end:10, prevI:3,nextI:3, prevV:0,nextV:5} ], // 19
    ['nextV', {urlKey:'v', videoId:'abcdefghij2', start:11,end:12, prevI:5,nextI:5, prevV:3,nextV:0} ], // 20
  ];

  _(steps).each(function (tuple, i) {
    assert.deepEqual(Playlist.go(tuple[0]), tuple[1], 'incorrect playlist step #' + i);
  });
});


QUnit.module('URL Normalizer');

QUnit.test('YouTube with start parameter', function (assert) {
  assert.deepEqual(normalizeUrl('http://yt.aergia.eu/watch?v=T0rs3R4E1Sk#t=23;30'),
                                'http://yt.aergia.eu/#v=T0rs3R4E1Sk&t=23;30',
                                'regression');
});

QUnit.test('YouTube with feature parameter in the front', function (assert) {
  assert.deepEqual(normalizeUrl('http://yt.aergia.eu/watch?feature=player_detailpage&v=n0CJfPsPOqE#t=245'),
                                'http://yt.aergia.eu/#v=n0CJfPsPOqE&t=245',
                                'regression');
});

QUnit.test('YouTube with feature parameter at the end', function (assert) {
  assert.deepEqual(normalizeUrl('https://yt.aergia.eu/#v=D033L_aSsCw&feature=youtu.be'),
                                'https://yt.aergia.eu/#v=D033L_aSsCw',
                                'regression');
});

QUnit.test('Classic GET with parameters', function (assert) {
  assert.deepEqual(normalizeUrl('http://yt.aergia.eu/?v=T0rs3R4E1Sk&t=23;30'),
                                'http://yt.aergia.eu/#v=T0rs3R4E1Sk&t=23;30',
                                'regression');
});

QUnit.test('Legacy with ":"', function (assert) {
  assert.deepEqual(normalizeUrl('http://yt.aergia.eu/#v=T0rs3R4E1Sk:t=23;30'),
                                'http://yt.aergia.eu/#v=T0rs3R4E1Sk&t=23;30',
                                'regression');
});

QUnit.test('Legacy with multiple "#"', function (assert) {
  assert.deepEqual(normalizeUrl('http://yt.aergia.eu/#v=T0rs3R4E1Sk#t=23;30'),
                                'http://yt.aergia.eu/#v=T0rs3R4E1Sk&t=23;30',
                                'regression');
});

QUnit.test('Legacy with multiple "#" as "%23"', function (assert) {
  assert.deepEqual(normalizeUrl('http://yt.aergia.eu/#v=T0rs3R4E1Sk%23t=23;30'),
                                'http://yt.aergia.eu/#v=T0rs3R4E1Sk&t=23;30',
                                'regression');
});

QUnit.test('URLs butchered by IM clients', function (assert) {
  // yes, this really happened.. in MS Lync
  assert.deepEqual(normalizeUrl('https://yt.aergia.eu/#v=aLcHJN1soY4%26t=41s%3b45s'),
                                'https://yt.aergia.eu/#v=aLcHJN1soY4&t=41s;45s',
                                'regression');
});

QUnit.test('Alternative time separator: \':\'', function (assert) {
  assert.deepEqual(normalizeUrl('http://yt.aergia.eu/#v=T0rs3R4E1Sk&t=23:30s'),
                                'http://yt.aergia.eu/#v=T0rs3R4E1Sk&t=23;30s',
                                'regression');
});

QUnit.test('Alternative time separator: \'-\'', function (assert) {
  assert.deepEqual(normalizeUrl('http://yt.aergia.eu/#v=T0rs3R4E1Sk&t=23s-30'),
                                'http://yt.aergia.eu/#v=T0rs3R4E1Sk&t=23s;30',
                                'regression');
});

QUnit.test('Support decimal in time attribute', function (assert) {
  assert.deepEqual(normalizeUrl('https://yt.aergia.eu/#v=_SKdN1xQBjk&t=72.5;1m16s'),
                                'https://yt.aergia.eu/#v=_SKdN1xQBjk&t=72.5;1m16s',
                                'regression');
});

QUnit.test('Fix decimal in time attribute', function (assert) {
  assert.deepEqual(normalizeUrl('https://yt.aergia.eu/#v=_SKdN1xQBjk&t=72,5;1m16s'),
                                'https://yt.aergia.eu/#v=_SKdN1xQBjk&t=72.5;1m16s',
                                'regression');
});


QUnit.module('YouTube Playlist Import');

QUnit.test('Inline playlist with 21 items', function (assert) {
  // sample YouTube API response for playlistId=PLyALKMPGOR5evINIHBRgtioZBuujYFaeS
  var testData = {testData: {'0':'nJBxKT7EGKI','1':'eRs_U6eYl-c','2':'cWn9JN4gSsk','3':'vnncm3MbMLs','4':'3Hv1DElPXV0','5':'PLb57RNlqJc','6':'S0COlNTizwo','7':'phrRu6lACcE','8':'FGs57y4nA_Y','9':'U8-rNMPTnyg','10':'XCzdTxRBDW8','11':'wY-kAnvOY80','12':'QaLFAlUp1U8','13':'4bnb8ti0JGU','14':'uxp54wEhQi8','15':'RyZU9ptzy68','16':'vCVN5pLXoo4','17':'jA8inmHhx8c','18':'GINpKSkZawk','19':'qk2_IY9w4Og','20':'_G04b2sZvSM','21':'rLrtEyisDMU'}};
  assert.deepEqual(inlineYTPlaylist(testData,'PLyALKMPGOR5evINIHBRgtioZBuujYFaeS'),
                                'v=nJBxKT7EGKI&v=eRs_U6eYl-c&v=cWn9JN4gSsk&v=vnncm3MbMLs&v=3Hv1DElPXV0&v=PLb57RNlqJc&v=S0COlNTizwo&v=phrRu6lACcE&v=FGs57y4nA_Y&v=U8-rNMPTnyg&v=XCzdTxRBDW8&v=wY-kAnvOY80&v=QaLFAlUp1U8&v=4bnb8ti0JGU&v=uxp54wEhQi8&v=RyZU9ptzy68&v=vCVN5pLXoo4&v=jA8inmHhx8c&v=GINpKSkZawk&v=qk2_IY9w4Og&v=_G04b2sZvSM&v=rLrtEyisDMU',
                                'regression in inlineYouTubePlaylist()');
});

QUnit.test('Keep index attribute in URL', function (assert) {
  // just to be sure that it is not removed from normalizer by mistake during refactoring in future
  assert.deepEqual(normalizeUrl('https://yt.aergia.eu/#v=nJBxKT7EGKI&v=eRs_U6eYl-c&v=cWn9JN4gSsk&index=2'),
                                'https://yt.aergia.eu/#v=nJBxKT7EGKI&v=eRs_U6eYl-c&v=cWn9JN4gSsk&index=2',
                                'regression');
});

QUnit.test('Recalculate index: Sample A1', function (assert) {
  // This is intermediate step triggered by &list= element, performed AFTER deduplication
  // In this test we have 3 videos before imported playlist, so index should be changed from 13 to 16
  var originalUrl = 'https://yt.aergia.eu/#v=eRs_U6eYl-c&v=cWn9JN4gSsk&v=ZNno63ZO2Lw&list=PLyALKMPGOR5evINIHBRgtioZBuujYFaeS&index=13';
  var recalculatedUrl = originalUrl.replace(/(#.+&|#)list=[^&]+&index=(\d+)/, recalculateYTPlaylistIndex);
  var expectedUrl = 'https://yt.aergia.eu/#v=eRs_U6eYl-c&v=cWn9JN4gSsk&v=ZNno63ZO2Lw&list=PLyALKMPGOR5evINIHBRgtioZBuujYFaeS&index=16';
  assert.deepEqual(recalculatedUrl, expectedUrl, 'regression');
});

QUnit.test('Recalculate index: Sample B1', function (assert) {
  // This is intermediate step triggered by &list= element, performed AFTER deduplication
  // In this test we have no videos before imported playlist, so index should remain 13
  var originalUrl = 'https://yt.aergia.eu/#list=PLyALKMPGOR5evINIHBRgtioZBuujYFaeS&index=13';
  var recalculatedUrl = originalUrl.replace(/(#.+&|#)list=[^&]+&index=(\d+)/, recalculateYTPlaylistIndex);
  assert.deepEqual(recalculatedUrl, originalUrl, 'regression');
});


QUnit.test('Recalculate index: Sample A2', function (assert) {
  // This is intermediate step triggered by &list= element, performed AFTER deduplication
  // In this test we have 3 videos before imported playlist, so index should be changed from 13 to 16
  var originalUrl = 'https://yt.aergia.eu/#v=eRs_U6eYl-c&v=cWn9JN4gSsk&v=ZNno63ZO2Lw&index=13&list=PLyALKMPGOR5evINIHBRgtioZBuujYFaeS';
  var recalculatedUrl = originalUrl.replace(/(#.+&|#)index=(\d+)&list=[^&]+/, recalculateYTPlaylistIndex);
  var expectedUrl = 'https://yt.aergia.eu/#v=eRs_U6eYl-c&v=cWn9JN4gSsk&v=ZNno63ZO2Lw&index=16&list=PLyALKMPGOR5evINIHBRgtioZBuujYFaeS';
  assert.deepEqual(recalculatedUrl, expectedUrl, 'regression');
});


QUnit.test('Recalculate index: Sample B2', function (assert) {
  // This is intermediate step triggered by &list= element, performed AFTER deduplication
  // In this test we have no videos before imported playlist, so index should remain 13
  var originalUrl = 'https://yt.aergia.eu/#index=13&list=PLyALKMPGOR5evINIHBRgtioZBuujYFaeS';
  var recalculatedUrl = originalUrl.replace(/(#.+&|#)index=(\d+)&list=[^&]+/, recalculateYTPlaylistIndex);
  assert.deepEqual(recalculatedUrl, originalUrl, 'regression');
});

QUnit.module('Tokenized Playlist Inlining');

QUnit.test('Encode', function (assert) {
  var playlist = 'v=nJBxKT7EGKI&v=eRs_U6eYl-c&v=cWn9JN4gSsk&index=2&v=T0rs3R4E1Sk&t=23s;30';
  var expectedToken = '763D6E4A42784B543745474B4926763D6552735F553665596C2D6326763D63576E394A4E346753736B26696E6465783D3226763D543072733352344531536B26743D3233733B3330.2604CC9A';
  assert.deepEqual(encodeToken(playlist), expectedToken, 'token encoding error');
});

QUnit.test('Decode', function (assert) {
  var token = '763D6E4A42784B543745474B4926763D6552735F553665596C2D6326763D63576E394A4E346753736B26696E6465783D3226763D543072733352344531536B26743D3233733B3330.2604CC9A';
  var expectedPlaylist = 'v=nJBxKT7EGKI&v=eRs_U6eYl-c&v=cWn9JN4gSsk&index=2&v=T0rs3R4E1Sk&t=23s;30';
  assert.deepEqual(decodeToken(token), expectedPlaylist, 'token decoding error');
});

QUnit.test('Encode+Decode', function (assert) {
  var playlist = 'v=nJBxKT7EGKI&v=eRs_U6eYl-c&v=cWn9JN4gSsk&index=2&v=T0rs3R4E1Sk&t=23s;30';
  assert.deepEqual(decodeToken(encodeToken(playlist)), playlist, 'token encoding+decoding error');
});


QUnit.module('Minimizing URLs From Known Services');

QUnit.test('Direct Image URL', function (assert) {
  assert.deepEqual(normalizeUrl('https://yt.aergia.eu/#i=https://goo.gl/R9z9r0'),
                                'https://yt.aergia.eu/#i=goo.gl/R9z9r0',
                                'Direct Image URL regression');
});

QUnit.test('Direct Video URL', function (assert) {
  assert.deepEqual(normalizeUrl('https://yt.aergia.eu/#v=https://goo.gl/WN8BkV'),
                                'https://yt.aergia.eu/#v=goo.gl/WN8BkV',
                                'Direct Video URL regression');
});

QUnit.test('Direct Imgur URL', function (assert) {
  assert.deepEqual(normalizeUrl('http://yt.aergia.eu/#i=https://i.imgur.com/fooo.gif'),
                                'http://yt.aergia.eu/#i=fooo.gif',
                                'Direct Imgur URL regression');
});

QUnit.test('Public IPFS Gateway URL', function (assert) {
  assert.deepEqual(normalizeUrl('http://yt.aergia.eu/#i=https://ipfs.io/ipfs/QmYHNYAaYK5hm3ZhZFx5W9H6xydKDGimjdgJMrMSdnctEm'),
                                'http://yt.aergia.eu/#i=/ipfs/QmYHNYAaYK5hm3ZhZFx5W9H6xydKDGimjdgJMrMSdnctEm',
                                'IPFS URL regression');
});

QUnit.test('fs: IPFS URI', function (assert) {
  assert.deepEqual(normalizeUrl('http://yt.aergia.eu/#i=fs:/ipfs/QmYHNYAaYK5hm3ZhZFx5W9H6xydKDGimjdgJMrMSdnctEm'),
                                'http://yt.aergia.eu/#i=/ipfs/QmYHNYAaYK5hm3ZhZFx5W9H6xydKDGimjdgJMrMSdnctEm',
                                'IPFS URL regression');
});


QUnit.test('web+fs: IPFS URI', function (assert) {
  assert.deepEqual(normalizeUrl('http://yt.aergia.eu/#i=web+fs:/ipfs/QmYHNYAaYK5hm3ZhZFx5W9H6xydKDGimjdgJMrMSdnctEm'),
                                'http://yt.aergia.eu/#i=/ipfs/QmYHNYAaYK5hm3ZhZFx5W9H6xydKDGimjdgJMrMSdnctEm',
                                'IPFS URL regression');
});

QUnit.module('Additional Flags');

QUnit.test('&autoplay', function (assert) {
  var url = 'http://yt.aergia.eu/watch?v=T0rs3R4E1Sk';
  assert.ok(!urlFlag('autoplay', normalizeUrl(url)));
  assert.ok(urlFlag('autoplay', normalizeUrl(url + '&autoplay')));
});

// vim:ts=2:sw=2:et:
