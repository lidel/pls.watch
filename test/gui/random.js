module.exports = {

  'No "random" option for single interval' : function (browser) {
    browser.page.looper()
      .uri('#i=cJjBEQP.png')
      .waitForElementVisible('#player')
      .assert.hidden('#random-ui')
      .end();
  },

  'Enabling random mode via #menu item in multivideo playlist' : function (browser) {
    browser.page.looper()
      .uri('#i=cJjBEQP.png&v=ZuHZSbPJhaY')
      .waitForElementVisible('#player')
      .assert.visible('#random-ui')
      .assert.cssClassNotPresent('#random', 'ticker')
      .click('#random')
      .waitForElementVisible('#player')
      .assert.uriEquals('#i=cJjBEQP.png&v=ZuHZSbPJhaY&random')
      .assert.cssClassPresent('#random', 'ticker')
      .click('#random')
      .waitForElementVisible('#player')
      .assert.uriEquals('#i=cJjBEQP.png&v=ZuHZSbPJhaY')
      .assert.cssClassNotPresent('#random', 'ticker')
      .end();
  },

};
