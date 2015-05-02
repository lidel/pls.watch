module.exports = {

  'Autosize of YouTube video' : function (browser) {
    browser
      .resizeWindow(640,360)
      .page.looper()
      .uri('#v=T0rs3R4E1Sk&t=23;30')
      .waitForElementVisible('iframe#player')
      .assert.visible('#autosize-ui')
      .assert.cssClassPresent('#autosize-toggle','ticker')
      .getElementSize('#player', function(result) {
        console.log('For 640x360 window YT player size should be 320x240');
        this.assert.equal(result.value.width, 320);
        this.assert.equal(result.value.height, 240);
      })
      .resizeWindow(1920,1080)
      .pause(800) //wait for animation to finish
      .getElementSize('#player', function(result) {
        console.log('For 1920x1080 window YT player size should be 1280x720');
        this.assert.equal(result.value.width, 1280);
        this.assert.equal(result.value.height, 720);
      })
      .click('#autosize-toggle')
      .pause(800) //wait for animation to finish
      .getElementSize('#player', function(result) {
        console.log('When autosize is disabled, default YT size should be 640x360');
        this.assert.cssClassNotPresent('#autosize-toggle','ticker');
        this.assert.equal(result.value.width, 640);
        this.assert.equal(result.value.height, 360);
      })
      .click('#autosize-toggle')
      .end();
  },

};
