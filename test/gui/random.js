module.exports = {

  'No "random" option for single interval' : function (browser) {
    browser.maximizeWindow()
      .url('http://127.0.0.1:28080/#i=cJjBEQP.png')
      .waitForElementVisible('#player', 100000)
      .assert.hidden('#random-ui')
      .end();
  },

  'Clicking on "random" in multivideo playlist' : function (browser) {
    browser.maximizeWindow()
      .url('http://127.0.0.1:28080/#i=cJjBEQP.png&v=ZuHZSbPJhaY')
      .waitForElementVisible('#player', 100000)
      .assert.visible('#random-ui')
      .assert.cssClassNotPresent('#random', 'ticker')
      .click('#random')
      .waitForElementVisible('#player', 100000)
      .assert.urlEquals('http://127.0.0.1:28080/#i=cJjBEQP.png&v=ZuHZSbPJhaY&random')
      .assert.cssClassPresent('#random', 'ticker')
      .click('#random')
      .waitForElementVisible('#player', 100000)
      .assert.urlEquals('http://127.0.0.1:28080/#i=cJjBEQP.png&v=ZuHZSbPJhaY')
      .assert.cssClassNotPresent('#random', 'ticker')
      .end();
  },

};
