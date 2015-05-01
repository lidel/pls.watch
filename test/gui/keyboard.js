module.exports = {

  'Jump to previous/next video via "k/j" keys' : function (browser) {
    browser
      .page.looper()
      .uri('#v=ZNno63ZO2Lw&t=54s;1m20s+1m33s;1m47s+3m30s;3m46s&i=cJjBEQP.png&i=qlGS0UC.jpg')
      .waitForElementVisible('iframe#player')
      .keys(['e','j','j']) // open editor, jump two videos forward
      .waitForElementVisible('div#player')
      .assert.title('qlGS0UC.jpg')
      .waitForElementVisible('#editor .highlighted')
      .assert.editorHighlightUri('i=qlGS0UC.jpg')
      .keys('k') // jump one video back
      .waitForElementVisible('div#player')
      .assert.title('cJjBEQP.png')
      .waitForElementVisible('#editor .highlighted')
      .assert.editorHighlightUri('i=cJjBEQP.png')
      .end();
  },

  'Jump to previous/next interval of current video via "h/l" keys' : function (browser) {
    browser
      .page.looper()
      .uri('#v=ZNno63ZO2Lw&t=54s;1m20s+1m33s;1m47s+3m30s;3m46s&i=cJjBEQP.png&i=qlGS0UC.jpg')
      .waitForElementVisible('iframe#player')
      .keys(['l','l']) // open editor, jump two intervals forward
      .waitForElementVisible('iframe#player')
      .keys('e')
      .waitForElementVisible('#editor .highlighted')
      .assert.editorHighlightUri('v=ZNno63ZO2Lw&t=3m30s;3m46s')
      .keys('h') // jump one interval back
      .waitForElementVisible('iframe#player')
      .waitForElementVisible('#editor .highlighted')
      .assert.editorHighlightUri('v=ZNno63ZO2Lw&t=1m33s;1m47s')
      .end();
  },


  'Jumping to random interval via "r" keyboard shortcut' : function (browser) {
    browser.page.looper()
      .uri('#v=ZNno63ZO2Lw&t=54s;1m20s+1m33s;1m47s')
      .waitForElementVisible('iframe#player')
      .keys('e')
      .waitForElementVisible('#editor .highlighted')
      .assert.editorHighlightUri('v=ZNno63ZO2Lw&t=54s;1m20s')
      .keys('r') // playlist has only two items so it always jump to other video
      .waitForElementVisible('iframe#player')
      .waitForElementVisible('#editor .highlighted')
      .assert.editorHighlightUri('v=ZNno63ZO2Lw&t=1m33s;1m47s')
      .keys('r') // playlist has only two items so it always jump to other video
      .waitForElementVisible('iframe#player')
      .waitForElementVisible('#editor .highlighted')
      .assert.editorHighlightUri('v=ZNno63ZO2Lw&t=54s;1m20s')
      .end();
  },
};
