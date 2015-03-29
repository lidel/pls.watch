
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

  Playlist(normalizeUrl(href));

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

QUnit.test('YouTube with feature parameter', function (assert) {
  assert.deepEqual(normalizeUrl('http://yt.aergia.eu/watch?feature=player_detailpage&v=n0CJfPsPOqE#t=245'),
                                'http://yt.aergia.eu/#v=n0CJfPsPOqE&t=245',
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


// vim:ts=2:sw=2:et:
