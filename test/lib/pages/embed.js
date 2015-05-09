module.exports = function (browser) {
  this.uri = function(uri) {
    browser
      .url('http://yt.127.0.0.1.xip.io:28080/test/embed.html' + uri)
      .waitForElementPresent('iframe')
      .frame(0)
      .waitForElementPresent('#player');
    return browser;
  };
};
