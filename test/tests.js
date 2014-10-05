QUnit.test('qunit self-test', function (assert) {
  assert.ok(1 == '1', 'Passed!');
});

QUnit.module('Basic URL parsing');

QUnit.test('one video, one interval', function (assert) {
  var url = 'http://yt.aergia.eu/#v=T0rs3R4E1Sk:t=23;30';
  var urls = [url, url.replace(':','&')];
  var expected_intervals = [{'start':23,'end':30}];

  _(urls).each(function (test_url, i) {
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
  var expected_intervals = [{'start':54,'end':80},{'start':93,'end':107},{'start':210,'end':226}];

  _(urls).each(function (test_url, i) {
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

  _(urls).each(function (test_url, i) {
    var videos = parseVideos(test_url);
    assert.ok(videos.length == 2, 'incorrect number of detected videos');

    test_url = videos[0];
    expected_intervals = [{'start':54,'end':80},{'start':93,'end':107},{'start':210,'end':226}];
    assert.deepEqual(getParam(test_url, 'v'), 'ZNno63ZO2Lw', 'incorrect video id for test_url #' + i);
    assert.deepEqual(getParam(test_url, 't'), '54;1m20s+1m33s;1m47s+3m30s;3m46s', 'incorrect interval data for test_url #' + i);
    assert.deepEqual(parseIntervals(test_url, 't'), expected_intervals, 'incorrect parseIntervals result for test_url #' + i);


    test_url = videos[1];
    expected_intervals = [{'start':2,'end':16}];
    assert.deepEqual(getParam(test_url, 'v'), 'TM1Jy3qPSCQ', 'incorrect video id for test_url #' + i);
    assert.deepEqual(getParam(test_url, 't'), '2;16s', 'incorrect interval data for test_url #' + i);
    assert.deepEqual(parseIntervals(test_url, 't'), expected_intervals, 'incorrect parseIntervals result for test_url #' + i);
  });

});

QUnit.module('Advanced interval indexing');

QUnit.test('schemes: 0 ; 0 0 ; 0 0 0', function (assert) {
  var hrefs = ['v=abcdefghij0',
               'v=abcdefghij0:v=abcdefghij1',
               'v=abcdefghij0:v=abcdefghij1:v=abcdefghij2'];

  var expected_intervals = [
    [{videoId:'abcdefghij0', start:0,end:null, prevI:0,nextI:0, prevV:0,nextV:0}],

    [{videoId:'abcdefghij0', start:0,end:null, prevI:0,nextI:0, prevV:1,nextV:1},
     {videoId:'abcdefghij1', start:0,end:null, prevI:1,nextI:1, prevV:0,nextV:0}],

    [{videoId:'abcdefghij0', start:0,end:null, prevI:0,nextI:0, prevV:2,nextV:1},
     {videoId:'abcdefghij1', start:0,end:null, prevI:1,nextI:1, prevV:0,nextV:2},
     {videoId:'abcdefghij2', start:0,end:null, prevI:2,nextI:2, prevV:1,nextV:0}],
  ];

  _(_.zip(hrefs,expected_intervals)).each(function (tuple, i) {
    var generated = jackiechanMyIntervals(tuple[0]);
    assert.deepEqual(generated.intervals, tuple[1], 'incorrect intervals for input #' + i);
  });
});

QUnit.test('schemes: 1 ; 1 0 ; 1 0 0', function (assert) {
  var hrefs = ['v=abcdefghij0:t=1s;2s',
               'v=abcdefghij0:t=1s;2s:v=abcdefghij1',
               'v=abcdefghij0:t=1s;2s:v=abcdefghij1:v=abcdefghij2'];

  var expected_intervals = [
    [{videoId:'abcdefghij0', start:1,end:2, prevI:0,nextI:0, prevV:0,nextV:0}],

    [{videoId:'abcdefghij0', start:1,end:   2, prevI:0,nextI:0, prevV:1,nextV:1},
     {videoId:'abcdefghij1', start:0,end:null, prevI:1,nextI:1, prevV:0,nextV:0}],

    [{videoId:'abcdefghij0', start:1,end:   2, prevI:0,nextI:0, prevV:2,nextV:1},
     {videoId:'abcdefghij1', start:0,end:null, prevI:1,nextI:1, prevV:0,nextV:2},
     {videoId:'abcdefghij2', start:0,end:null, prevI:2,nextI:2, prevV:1,nextV:0}],
  ];

  _(_.zip(hrefs,expected_intervals)).each(function (tuple, i) {
    var generated = jackiechanMyIntervals(tuple[0]);
    assert.deepEqual(generated.intervals, tuple[1], 'incorrect intervals for input #' + i);
  });
});

QUnit.test('schemes: 2 ; 2 0 ; 2 0 0', function (assert) {
  var hrefs = ['v=abcdefghij0:t=1s;2s+3s;4s',
               'v=abcdefghij0:t=1s;2s+3s;4s:v=abcdefghij1',
               'v=abcdefghij0:t=1s;2s+3s;4s:v=abcdefghij1:v=abcdefghij2'];

  var expected_intervals = [
    [{videoId:'abcdefghij0', start:1,end:2, prevI:1,nextI:1, prevV:0,nextV:0},
     {videoId:'abcdefghij0', start:3,end:4, prevI:0,nextI:0, prevV:0,nextV:0}],

    [{videoId:'abcdefghij0', start:1,end:   2, prevI:1,nextI:1, prevV:2,nextV:2},
     {videoId:'abcdefghij0', start:3,end:   4, prevI:0,nextI:0, prevV:2,nextV:2},
     {videoId:'abcdefghij1', start:0,end:null, prevI:2,nextI:2, prevV:0,nextV:0}],

    [{videoId:'abcdefghij0', start:1,end:   2, prevI:1,nextI:1, prevV:3,nextV:2},
     {videoId:'abcdefghij0', start:3,end:   4, prevI:0,nextI:0, prevV:3,nextV:2},
     {videoId:'abcdefghij1', start:0,end:null, prevI:2,nextI:2, prevV:0,nextV:3},
     {videoId:'abcdefghij2', start:0,end:null, prevI:3,nextI:3, prevV:2,nextV:0}],
  ];

  _(_.zip(hrefs,expected_intervals)).each(function (tuple, i) {
    var generated = jackiechanMyIntervals(tuple[0]);
    assert.deepEqual(generated.intervals, tuple[1], 'incorrect intervals for input #' + i);
  });
});

QUnit.test('schemes: 3 ; 3 2 ; 3 2 1', function (assert) {
  var hrefs = ['v=abcdefghij0:t=1s;2s+3s;4s+5s;6s',
               'v=abcdefghij0:t=1s;2s+3s;4s+5s;6s:v=abcdefghij1:t=7s;8s+9s;10s',
               'v=abcdefghij0:t=1s;2s+3s;4s+5s;6s:v=abcdefghij1:t=7s;8s+9s;10s:v=abcdefghij2:t=11s;12s'];

  var expected_intervals = [
    [{videoId:'abcdefghij0', start:1,end:2, prevI:2,nextI:1, prevV:0,nextV:0},
     {videoId:'abcdefghij0', start:3,end:4, prevI:0,nextI:2, prevV:0,nextV:0},
     {videoId:'abcdefghij0', start:5,end:6, prevI:1,nextI:0, prevV:0,nextV:0}],

    [{videoId:'abcdefghij0', start:1,end: 2, prevI:2,nextI:1, prevV:3,nextV:3},
     {videoId:'abcdefghij0', start:3,end: 4, prevI:0,nextI:2, prevV:3,nextV:3},
     {videoId:'abcdefghij0', start:5,end: 6, prevI:1,nextI:0, prevV:3,nextV:3},
     {videoId:'abcdefghij1', start:7,end: 8, prevI:4,nextI:4, prevV:0,nextV:0},
     {videoId:'abcdefghij1', start:9,end:10, prevI:3,nextI:3, prevV:0,nextV:0}],

    [{videoId:'abcdefghij0', start: 1,end: 2, prevI:2,nextI:1, prevV:5,nextV:3},
     {videoId:'abcdefghij0', start: 3,end: 4, prevI:0,nextI:2, prevV:5,nextV:3},
     {videoId:'abcdefghij0', start: 5,end: 6, prevI:1,nextI:0, prevV:5,nextV:3},
     {videoId:'abcdefghij1', start: 7,end: 8, prevI:4,nextI:4, prevV:0,nextV:5},
     {videoId:'abcdefghij1', start: 9,end:10, prevI:3,nextI:3, prevV:0,nextV:5},
     {videoId:'abcdefghij2', start:11,end:12, prevI:5,nextI:5, prevV:3,nextV:0}],
  ];

  _(_.zip(hrefs,expected_intervals)).each(function (tuple, i) {
    var generated = jackiechanMyIntervals(tuple[0]);
    assert.deepEqual(generated.intervals, tuple[1], 'incorrect intervals for input #' + i);
  });
});

QUnit.module('Basic playlist directions');

QUnit.test('scheme: 3 2 1 : +I +I +I +I -V -I +V +V +V +V -I +I -V -V -V -V -V -I -I -I +V', function (assert) {
  var href = '#v=abcdefghij0:t=1s;2s+3s;4s+5s;6s:v=abcdefghij1:t=7s;8s+9s;10s:v=abcdefghij2:t=11s;12s';

  playlist(href);

  var steps = [
    ['nextI', {videoId:'abcdefghij0', start: 3,end: 4, prevI:0,nextI:2, prevV:5,nextV:3} ], // 0
    ['nextI', {videoId:'abcdefghij0', start: 5,end: 6, prevI:1,nextI:0, prevV:5,nextV:3} ], // 1
    ['nextI', {videoId:'abcdefghij0', start: 1,end: 2, prevI:2,nextI:1, prevV:5,nextV:3} ], // 2
    ['nextI', {videoId:'abcdefghij0', start: 3,end: 4, prevI:0,nextI:2, prevV:5,nextV:3} ], // 3
    ['prevV', {videoId:'abcdefghij2', start:11,end:12, prevI:5,nextI:5, prevV:3,nextV:0} ], // 4
    ['prevI', {videoId:'abcdefghij2', start:11,end:12, prevI:5,nextI:5, prevV:3,nextV:0} ], // 5
    ['nextV', {videoId:'abcdefghij0', start: 1,end: 2, prevI:2,nextI:1, prevV:5,nextV:3} ], // 6
    ['nextV', {videoId:'abcdefghij1', start: 7,end: 8, prevI:4,nextI:4, prevV:0,nextV:5} ], // 7
    ['nextV', {videoId:'abcdefghij2', start:11,end:12, prevI:5,nextI:5, prevV:3,nextV:0} ], // 8
    ['nextV', {videoId:'abcdefghij0', start: 1,end: 2, prevI:2,nextI:1, prevV:5,nextV:3} ], // 9
    ['prevI', {videoId:'abcdefghij0', start: 5,end: 6, prevI:1,nextI:0, prevV:5,nextV:3} ], // 10
    ['nextI', {videoId:'abcdefghij0', start: 1,end: 2, prevI:2,nextI:1, prevV:5,nextV:3} ], // 11
    ['prevV', {videoId:'abcdefghij2', start:11,end:12, prevI:5,nextI:5, prevV:3,nextV:0} ], // 12
    ['prevV', {videoId:'abcdefghij1', start: 7,end: 8, prevI:4,nextI:4, prevV:0,nextV:5} ], // 13
    ['prevV', {videoId:'abcdefghij0', start: 1,end: 2, prevI:2,nextI:1, prevV:5,nextV:3} ], // 14
    ['prevV', {videoId:'abcdefghij2', start:11,end:12, prevI:5,nextI:5, prevV:3,nextV:0} ], // 15
    ['prevV', {videoId:'abcdefghij1', start: 7,end: 8, prevI:4,nextI:4, prevV:0,nextV:5} ], // 16
    ['prevI', {videoId:'abcdefghij1', start: 9,end:10, prevI:3,nextI:3, prevV:0,nextV:5} ], // 17
    ['prevI', {videoId:'abcdefghij1', start: 7,end: 8, prevI:4,nextI:4, prevV:0,nextV:5} ], // 18
    ['prevI', {videoId:'abcdefghij1', start: 9,end:10, prevI:3,nextI:3, prevV:0,nextV:5} ], // 19
    ['nextV', {videoId:'abcdefghij2', start:11,end:12, prevI:5,nextI:5, prevV:3,nextV:0} ], // 20
  ];

  _(steps).each(function (step, i) {
    assert.deepEqual(playlist.go(step[0]), step[1], 'incorrect playlist step #' + i);
  });
});
// vim:ts=2:sw=2:et:
