module.exports = {

  'Player with single Imgur interval (png)' : function (browser) {
    browser
      .page.looper()
      .uri('#i=cJjBEQP&t=50s')
      .waitForElementVisible('div#player img')
      .keys(['e']) // open editor
      .waitForElementVisible('#editor .highlighted')
      .assert.editorHighlightUri('i=cJjBEQP&t=50s')
      .end();
  },

  'Player with single Imgur interval (gifv)' : function (browser) {
    browser
      .page.looper()
      .uri('#i=vo9DPpp&t=50s')
      .waitForElementPresent('div#player video#gifv')
      .keys(['e']) // open editor
      .waitForElementVisible('#editor .highlighted')
      .assert.editorHighlightUri('i=vo9DPpp&t=50s')
      .end();
  },

  'Autosize of Imgur player' : function (browser) {
    browser
      .resizeWindow(640,360)
      .page.looper()
      .uri('#i=cJjBEQP.png&i=VLIBa5v.gif')
      .waitForElementVisible('div#player')
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
      .resizeWindow(640,360)
      .keys('j')
      .waitForElementPresent('#gifv')
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
      .end();
  },



};
