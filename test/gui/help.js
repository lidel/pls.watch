module.exports = {

  'Clicking on "help" in #menu' : function (browser) {
    browser.maximizeWindow()
      .url('http://127.0.0.1:28080/#i=cJjBEQP.png')
      .waitForElementVisible('#menu', 100000)
      .assert.cssClassNotPresent('#help-toggle', 'ticker')
      .assert.hidden('#help')
      .click('#help-toggle')
      .waitForElementVisible('#help', 100000)
      .assert.cssClassPresent('#help-toggle','ticker')
      .assert.visible('#help')
      .click('#help-toggle')
      .waitForElementNotVisible('#help', 100000)
      .assert.cssClassNotPresent('#help-toggle', 'ticker')
      .assert.hidden('#help')
      .end();
  },

};
