module.exports = {

  'Clicking on "help" in #menu' : function (browser) {
    browser
      .url('http://yt.127.0.0.1.xip.io:28080/#i=cJjBEQP.png')
      .waitForElementVisible('#menu')
      .assert.cssClassNotPresent('#help-toggle', 'ticker')
      .assert.hidden('#help')
      .click('#help-toggle')
      .waitForElementVisible('#help')
      .assert.cssClassPresent('#help-toggle','ticker')
      .assert.visible('#help')
      .keys('?') // use key as toggle button may be hidden by #help
      .waitForElementNotVisible('#help')
      .assert.cssClassNotPresent('#help-toggle', 'ticker')
      .assert.hidden('#help')
      .end();
  },

};
