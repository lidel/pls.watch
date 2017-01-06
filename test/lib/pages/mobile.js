module.exports = function (browser) {
  this.uri = function(uri) {
    browser
      .resizeWindow(667,375)
      .url('http://yt.127.0.0.1.xip.io:28080/' + uri + '&mobile')
      .waitForElementPresent('#player');
    return browser;
  };
};
