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

  'Jumping to random video via "r" keyboard shortcut' : function (browser) {
    browser.page.looper()
      .uri('#i=cJjBEQP.png&i=qlGS0UC.jpg') // use images for speed
      .waitForElementVisible('#player')
      .assert.title('cJjBEQP.png')
      .keys('r') // playlist has only two items so it always jump to other video
      .waitForElementVisible('#player')
      .assert.title('qlGS0UC.jpg')
      .keys('r') // playlist has only two items so it always jump to other video
      .waitForElementVisible('#player')
      .assert.title('cJjBEQP.png')
      .end();
  },
};
