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

  'Autosize of Imgur image' : function (browser) {
    browser
      .resizeWindow(640,360)
      .page.looper()
      .uri('#i=cJjBEQP.png&i=VLIBa5v.gif')
      .waitForElementVisible('div#player')
      .assert.visible('#autosize-ui')
      .assert.cssClassPresent('#autosize-toggle','ticker')
      .getElementSize('#player', function(result) {
        console.log('[png] For 640x360 window Imgur player fits inside of 320x240');
        this.assert.ok(result.value.width  <= 320, 'width  <=  320');
        this.assert.ok(result.value.height <= 240, 'height <=  240');
      })
      .resizeWindow(1920,1080)
      .pause(800) //wait for animation to finish
      .getElementSize('#player', function(result) {
        console.log('[png] For 1920x1080 window Imgur player fits inside of 1280x720');
        this.assert.ok(result.value.width  <= 1280, 'width  <= 1280');
        this.assert.ok(result.value.height <=  720, 'height <=  720');
      })
      .click('#autosize-toggle')
      .pause(800) //wait for animation to finish
      .getElementSize('#player', function(result) {
        console.log('[png] When autosize is disabled, default Imgur player fits inside of 640x360');
        this.assert.cssClassNotPresent('#autosize-toggle','ticker');
        this.assert.ok(result.value.width  <= 640, 'width  <=  640');
        this.assert.ok(result.value.height <= 360, 'height <=  360');
      })
      .click('#autosize-toggle')
      .resizeWindow(640,360)
      .keys('j')
      .waitForElementPresent('#gifv')
      .assert.visible('#autosize-ui')
      .assert.cssClassPresent('#autosize-toggle','ticker')
      .getElementSize('#player', function(result) {
        console.log('[gifv] For 640x360 window Imgur player fits inside of 320x240');
        this.assert.ok(result.value.width  <= 320, 'width  <=  320');
        this.assert.ok(result.value.height <= 240, 'height <=  240');
      })
      .resizeWindow(1920,1080)
      .pause(800) //wait for animation to finish
      .getElementSize('#player', function(result) {
        console.log('[gifv] For 1920x1080 window Imgur player fits inside of 1280x720');
        this.assert.ok(result.value.width  <= 1280, 'width  <= 1280');
        this.assert.ok(result.value.height <=  720, 'height <=  720');
      })
      .click('#autosize-toggle')
      .pause(800) //wait for animation to finish
      .getElementSize('#player', function(result) {
        console.log('[gifv] When autosize is disabled, default Imgur player fits inside of 640x360');
        this.assert.cssClassNotPresent('#autosize-toggle','ticker');
        this.assert.ok(result.value.width  <= 640, 'width  <=  640');
        this.assert.ok(result.value.height <= 360, 'height <=  360');
      })
      .click('#autosize-toggle')
      .end();
  },

  'Autosize of SoundCloud video' : function (browser) {
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
