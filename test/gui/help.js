module.exports = {

  'Clicking on "help" in #menu' : function (browser) {
    browser.maximizeWindow()
      .url('http://127.0.0.1:28080/#i=cJjBEQP.png')
      .waitForElementVisible('#menu', 30000, false)
      .assert.cssClassNotPresent('#help-toggle', 'ticker')
      .assert.hidden('#help')
      .click('#help-toggle')
      .pause(3000)
      .waitForElementVisible('#help', 30000, false)
      .assert.cssClassPresent('#help-toggle','ticker')
      .assert.visible('#help')
      .click('#help-toggle')
      .pause(3000)
      .waitForElementNotVisible('#help', 30000, false)
      .assert.cssClassNotPresent('#help-toggle', 'ticker')
      .assert.hidden('#help')
      .end();
  },

};
