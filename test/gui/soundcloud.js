module.exports = {

  'Recognize single SoundCloud sound as interval' : function (browser) {
    browser
      .page.looper()
      .uri('#s=juandedeboca/spacex-thales-mission-webcast-song')
      .waitForLoadedId('juandedeboca/spacex-thales-mission-webcast-song')
      .keys(['e']) // open editor
      .waitForElementVisible('#editor .highlighted')
      .assert.editorHighlightUri('s=juandedeboca/spacex-thales-mission-webcast-song')
      .end();
  },

  'Autosize of SoundCloud player' : function (browser) {
    if (browser.globals.skipOnTravis) return;
    /* For some reason SoundCloud widget adds 2px padding around the player.
     * This is not a big issue and for now we simply bump expected value in tests
     */
    browser
      .resizeWindow(640,360)
      .page.looper()
      .uri('#s=sacredbones/pharmakon-body-betrays-itself')
      .waitForElementVisible('iframe#player')
      .pause(800) //wait for animation to finish
      .getElementSize('#player', function(result) {
        console.log('For 640x360 window SC player size should be 516x292');
        this.assert.equal(result.value.width, 516);
        this.assert.equal(result.value.height, 292);
      })
      .resizeWindow(1920,1080)
      .pause(800) //wait for animation to finish
      .getElementSize('#player', function(result) {
        console.log('For 1920x1080 window SC player size should be 1536x864');
        this.assert.equal(result.value.width, 1540);
        this.assert.equal(result.value.height, 868);
      })
      .end();
  },


};
