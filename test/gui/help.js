module.exports = {

  'Clicking on "help" in #menu' : function (browser) {
    browser
      .url('http://127.0.0.1:28080/#v=lWqJTKdznaM')
      .waitForElementVisible('#player', 3000)
      .assert.hidden('#help')
      .assert.cssClassNotPresent('#help-toggle', 'ticker')
      .click('#help-toggle')
      .waitForElementVisible('#help', 1000)
      .assert.visible('#help')
      .assert.cssClassPresent('#help-toggle','ticker')
      .click('#help-toggle')
      .waitForElementNotVisible('#help', 1000)
      .assert.hidden('#help')
      .assert.cssClassNotPresent('#help-toggle', 'ticker')
      .end();
  },

};
