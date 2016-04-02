module.exports = {

  'Jump to previous/next video via "k/j" keys' : function (browser) {
    browser
      .page.looper()
      .uri('#v=ZNno63ZO2Lw&t=54s;1m20s+1m33s;1m47s+3m30s;3m46s&i=cJjBEQP.png&i=qlGS0UC.jpg&editor')
      .waitForLoadedId('ZNno63ZO2Lw')
      .waitForElementVisible('#editor .highlighted')
      .keys(['j','j']) // open editor, jump two videos forward
      .waitForLoadedId('qlGS0UC.jpg')
      .assert.title('qlGS0UC.jpg')
      .waitForElementVisible('#editor .highlighted')
      .assert.editorHighlightUri('i=qlGS0UC.jpg')
      .keys('k') // jump one video back
      .waitForLoadedId('cJjBEQP.png')
      .assert.title('cJjBEQP.png')
      .waitForElementVisible('#editor .highlighted')
      .assert.editorHighlightUri('i=cJjBEQP.png')
      .end();
  },

  'Jump to previous/next interval of current video via "h/l" keys' : function (browser) {
    browser
      .page.looper()
      .uri('#v=ZNno63ZO2Lw&t=54s;1m20s+1m33s;1m47s+3m30s;3m46s&i=cJjBEQP.png&i=qlGS0UC.jpg&editor')
      .waitForLoadedId('ZNno63ZO2Lw')
      .keys(['l','l']) // open editor, jump two intervals forward
      .waitForLoadedId('ZNno63ZO2Lw')
      .waitForElementVisible('#editor .highlighted')
      .assert.editorHighlightUri('v=ZNno63ZO2Lw&t=3m30s;3m46s')
      .keys('h') // jump one interval back
      .waitForLoadedId('ZNno63ZO2Lw')
      .waitForElementVisible('#editor .highlighted')
      .assert.editorHighlightUri('v=ZNno63ZO2Lw&t=1m33s;1m47s')
      .end();
  },


  'Jumping to random interval via "r" keyboard shortcut' : function (browser) {
    browser.page.looper()
      .uri('#v=ZNno63ZO2Lw&t=54s;1m20s+1m33s;1m47s&editor')
      .waitForLoadedId('ZNno63ZO2Lw')
      .waitForElementVisible('#editor .highlighted')
      .assert.editorHighlightUri('v=ZNno63ZO2Lw&t=54s;1m20s')
      .keys('r') // playlist has only two items so it always jump to other video
      .waitForLoadedId('ZNno63ZO2Lw')
      .waitForElementVisible('#editor .highlighted')
      .assert.editorHighlightUri('v=ZNno63ZO2Lw&t=1m33s;1m47s')
      .keys('r') // playlist has only two items so it always jump to other video
      .waitForLoadedId('ZNno63ZO2Lw')
      .waitForElementVisible('#editor .highlighted')
      .assert.editorHighlightUri('v=ZNno63ZO2Lw&t=54s;1m20s')
      .end();
  },
};
