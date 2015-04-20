module.exports = {
  'Demo test: Google yt-looper' : function (browser) {
    browser
      .url('https://www.google.com')
      .waitForElementVisible('body', 1000)
      .setValue('input[type=text]', 'yt-looper')
      .waitForElementVisible('button[name=btnG]', 1000)
      .click('button[name=btnG]')
      .pause(1000)
      .assert.containsText('#main', 'yt-looper')
      .end();
  }
};
