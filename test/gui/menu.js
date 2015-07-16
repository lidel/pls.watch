module.exports = {

  'Menu on the landing page' : function (browser) {
    browser.page.looper()
      .uri('')
      .waitForElementVisible('#help')
      .assert.visible('#help')
      .waitForElementPresent('#menu')
      .assert.hidden('#menu')
      .assert.hidden('#box')
      .assert.elementNotPresent('#player')
      .assert.elementNotPresent('#editor')
      .end();
  },

  'Menu on a single interval page' : function (browser) {
    browser.page.looper()
      .uri('#i=cJjBEQP.png')
      .waitForElementVisible('#player')
      .assert.elementNotPresent('#editor')
      .assert.visible('#menu')
      .assert.visible('#help-ui')
      .assert.visible('#shorten-ui')
      .assert.visible('#embed-ui')
      .assert.visible('#editor-ui')
      .assert.hidden('#random-ui')
      .assert.hidden('#help')
      .end();
  },

  'Menu on a multiple interval page' : function (browser) {
    browser.page.looper()
      .uri('#i=cJjBEQP.png&v=lWqJTKdznaM&v=ZuHZSbPJhaY')
      .waitForElementVisible('#player')
      .assert.elementNotPresent('#editor')
      .assert.visible('#help-ui')
      .assert.visible('#shorten-ui')
      .assert.visible('#embed-ui')
      .assert.visible('#editor-ui')
      .assert.visible('#random-ui')
      .assert.hidden('#help')
      .end();
  },

};
