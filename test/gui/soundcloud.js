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

  'Autosize of SoundCloud player' : function (browser) {
    /* For some reason SoundCloud widget adds 2px padding around the player.
     * This is not a big issue and for now we simply bump expected value in tests
     */
    browser
      .resizeWindow(640,360)
      .page.looper()
      .uri('#s=sacredbones/pharmakon-body-betrays-itself')
      .waitForElementVisible('iframe#player')
      .assert.visible('#autosize-ui')
      .assert.cssClassPresent('#autosize-toggle','ticker')
      .getElementSize('#player', function(result) {
        console.log('For 640x360 window SC player size should be 324x244');
        this.assert.equal(result.value.width, 324);
        this.assert.equal(result.value.height, 244);
      })
      .resizeWindow(1920,1080)
      .pause(800) //wait for animation to finish
      .getElementSize('#player', function(result) {
        console.log('For 1920x1080 window SC player size should be 1284x724');
        this.assert.equal(result.value.width, 1284);
        this.assert.equal(result.value.height, 724);
      })
      .click('#autosize-toggle')
      .pause(800) //wait for animation to finish
      .getElementSize('#player', function(result) {
        console.log('When autosize is disabled, default SC size should be 644x364');
        this.assert.cssClassNotPresent('#autosize-toggle','ticker');
        this.assert.equal(result.value.width, 644);
        this.assert.equal(result.value.height, 364);
      })
      .click('#autosize-toggle')
      .end();
  },


};
