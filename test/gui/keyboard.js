module.exports = {

  'Jump to previous/next ID via "k/j" keys' : function (browser) {
    browser
      .page.looper()
      .uri('#i=ke0HDf2.jpg&t=30+20+10&i=cJjBEQP.png&i=qlGS0UC.jpg&editor')
      .waitForLoadedId('ke0HDf2.jpg')
      .waitForElementVisible('#editor .highlighted')
      .elementIdClick('#editor')
      .keys('jj') // open editor, jump two videos forward
      .waitForLoadedId('qlGS0UC.jpg')
      .assert.title('qlGS0UC.jpg')
      .waitForElementVisible('#editor .highlighted')
      .assert.editorHighlightUri('i=qlGS0UC.jpg')
      .click('#editor')
      .pause(100)
      .keys('k') // jump one video back
      .waitForLoadedId('cJjBEQP.png')
      .assert.title('cJjBEQP.png')
      .waitForElementVisible('#editor .highlighted')
      .assert.editorHighlightUri('i=cJjBEQP.png')
      .end();
  },

  'Jump to previous/next interval of current ID via "h/l" keys' : function (browser) {
    browser
      .page.looper()
      .uri('#i=ke0HDf2.jpg&t=30+20+10&i=cJjBEQP.png&i=qlGS0UC.jpg&editor')
      .waitForLoadedId('ke0HDf2.jpg')
      .waitForElementVisible('#editor .highlighted')
      .click('#editor')
      .keys(['l','l']) // open editor, jump two intervals forward
      .waitForLoadedId('ke0HDf2.jpg')
      .waitForElementVisible('#editor .highlighted')
      .assert.editorHighlightUri('i=ke0HDf2.jpg&t=10s')
      .keys('h') // jump one interval back
      .waitForLoadedId('ke0HDf2.jpg')
      .waitForElementVisible('#editor .highlighted')
      .assert.editorHighlightUri('i=ke0HDf2.jpg&t=20s')
      .end();
  },


  'Jumping to random interval via "r" keyboard shortcut' : function (browser) {
    browser.page.looper()
      .uri('#i=ke0HDf2.jpg&t=20+10&editor')
      .waitForLoadedId('ke0HDf2.jpg')
      .waitForElementVisible('#editor .highlighted')
      .assert.editorHighlightUri('i=ke0HDf2.jpg&t=20s')
      .frame(null) // resetting the focus back up to the top level element
      .keys('r') // playlist has only two items so it always jump to other video
      .waitForLoadedId('ke0HDf2.jpg')
      .waitForElementVisible('#editor .highlighted')
      .assert.editorHighlightUri('i=ke0HDf2.jpg&t=10s')
      .frame(null) // resetting the focus back up to the top level element
      .keys('r') // playlist has only two items so it always jump to other video
      .waitForLoadedId('ke0HDf2.jpg')
      .waitForElementVisible('#editor .highlighted')
      .assert.editorHighlightUri('i=ke0HDf2.jpg&t=20s')
      .end();
  },
};
