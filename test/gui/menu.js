module.exports = {

  'Menu on the landing page' : function (browser) {
    browser
      .url('http://127.0.0.1:28080')
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#help')
      .assert.elementPresent('#menu')
      .assert.visible('#help')
      .assert.hidden('#menu')
      .assert.hidden('#box')
      .assert.elementNotPresent('#player')
      .assert.elementNotPresent('#editor')
      .end();
  },

  'Menu on a single video page' : function (browser) {
    browser
      .url('http://127.0.0.1:28080/#v=lWqJTKdznaM')
      .waitForElementVisible('#player', 3000)
      .assert.elementNotPresent('#editor')
      .assert.visible('#menu')
      .assert.visible('#help-ui')
      .assert.visible('#responsive-ui')
      .assert.visible('#shorten-ui')
      .assert.visible('#editor-ui')
      .assert.hidden('#random-ui')
      .assert.hidden('#help')
      .end();
  },

  'Menu on a multiple video page' : function (browser) {
    browser
      .url('http://127.0.0.1:28080/#v=lWqJTKdznaM&v=ZuHZSbPJhaY')
      .waitForElementVisible('#player', 3000)
      .assert.elementNotPresent('#editor')
      .assert.visible('#help-ui')
      .assert.visible('#responsive-ui')
      .assert.visible('#shorten-ui')
      .assert.visible('#editor-ui')
      .assert.visible('#random-ui')
      .assert.hidden('#help')
      .end();
  },

};
