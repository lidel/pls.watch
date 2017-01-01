module.exports = {

  'Inline external URL playlist' : function (browser) {
    browser
      .page.looper().uri('#list=http://yt.127.0.0.1.xip.io:28080/test/test-playlist.txt')
      .waitForElementVisible('#player')
      .waitForElementVisible('#editor')
      .waitForElementVisible('#refresh-from-external-url')
      .assert.uriEquals('#i=cJjBEQP&t=50s&i=vo9DPpp&t=50s&i=cJjBEQP.png&i=VLIBa5v.gif&index=2&editor')
      .assert.attributeEquals('#refresh-from-external-url', 'href', 'http://yt.127.0.0.1.xip.io:28080/#list=http://yt.127.0.0.1.xip.io:28080/test/test-playlist.txt')
      .end();
  },

};
