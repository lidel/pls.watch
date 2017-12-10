module.exports = {

  'Pressing "x" toggles Panic Mode' : function (browser) {
    browser
      .page.looper()
      .uri('#i=cJjBEQP.png&editor')
      .waitForLoadedId('cJjBEQP.png')
      .waitForElementVisible('#editor .highlighted')
      .assert.editorHighlightUri('i=cJjBEQP.png')
      .assert.title('cJjBEQP.png')
      .sendKeys('body', ['x'])
      .waitForElementVisible('#panicOverlay')
      .assert.hidden('#box')
      .assert.hidden('#player')
      .assert.title('Boot parsing error…')
      .sendKeys('body', ['x'])
      .waitForElementVisible('#box')
      .waitForElementVisible('#player')
      .assert.title('cJjBEQP.png')
      .assert.elementNotPresent('#panicOverlay')
      .end();
  },

};
