module.exports = {

  'No "random" option for single interval' : function (browser) {
    browser.page.looper()
      .uri('#i=cJjBEQP.png')
      .waitForElementVisible('#player', 100000)
      .assert.hidden('#random-ui')
      .end();
  },

  'Clicking on "random" in multivideo playlist' : function (browser) {
    browser.page.looper()
      .uri('#i=cJjBEQP.png&v=ZuHZSbPJhaY')
      .waitForElementVisible('#player')
      .assert.visible('#random-ui')
      .assert.cssClassNotPresent('#random', 'ticker')
      .click('#random')
      .waitForElementVisible('#player')
      .assert.uriEquals('#i=cJjBEQP.png&v=ZuHZSbPJhaY&random')
      .pause(2000)
      .saveScreenshot('random1.png')
      .assert.cssClassPresent('#random', 'ticker')
      .click('#random')
      .waitForElementVisible('#player')
      .assert.uriEquals('#i=cJjBEQP.png&v=ZuHZSbPJhaY')
      .assert.cssClassNotPresent('#random', 'ticker')
      .end();
  },

};
