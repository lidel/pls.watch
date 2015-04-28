module.exports = {

  'Recognize single SoundCloud sound as interval' : function (browser) {
    browser
      .page.looper()
      .uri('#s=juandedeboca/spacex-thales-mission-webcast-song')
      .waitForElementVisible('iframe#player')
      .keys(['e']) // open editor
      .waitForElementVisible('#editor .highlighted')
      .assert.editorHighlightUri('s=juandedeboca/spacex-thales-mission-webcast-song')
      .end();
  },

};
