module.exports = function (browser) {
  this.uri = function(uri) {
    browser
      .resizeWindow(1366,768)
      .url('http://yt.127.0.0.1.xip.io:28080/' + uri)
      .waitForElementPresent('body');
    return browser;
  };
};
