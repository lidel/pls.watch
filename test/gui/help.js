module.exports = {

  'Clicking on "help" in #menu' : function (browser) {
    browser
      .resizeWindow(1920,1080)
      .page.looper()
      .uri('#i=cJjBEQP')
      .waitForElementVisible('div#player img')
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
