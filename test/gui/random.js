module.exports = {

  'No "random" option for single interval' : function (browser) {
    browser.maximizeWindow()
      .url('http://127.0.0.1:28080/#v=lWqJTKdznaM')
      .waitForElementVisible('#player', 3000)
      .assert.hidden('#random-ui')
      .end();
  },

  'Clicking on "random" in multivideo playlist' : function (browser) {
    browser.maximizeWindow()
      .url('http://127.0.0.1:28080/#v=lWqJTKdznaM&v=ZuHZSbPJhaY')
      .waitForElementVisible('#player', 3000)
      .assert.visible('#random-ui')
      .assert.cssClassNotPresent('#random', 'ticker')
      .click('#random')
      .pause(100)
      .waitForElementVisible('#player', 3000)
      .assert.urlEquals('http://127.0.0.1:28080/#v=lWqJTKdznaM&v=ZuHZSbPJhaY&random')
      .assert.cssClassPresent('#random', 'ticker')
      .click('#random')
      .pause(100)
      .waitForElementVisible('#player', 3000)
      .assert.urlEquals('http://127.0.0.1:28080/#v=lWqJTKdznaM&v=ZuHZSbPJhaY')
      .assert.cssClassNotPresent('#random', 'ticker')
      .end();
  },

};
