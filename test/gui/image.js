module.exports = {

  'Player with single Image interval (png)' : function (browser) {
    browser
      .page.looper()
      .uri('#i=http://yt.127.0.0.1.xip.io:28080/assets/zwartevilt.png&t=50s')
      .waitForElementVisible('div#player img')
      .keys(['e']) // open editor
      .waitForElementVisible('#editor .highlighted')
      .assert.editorHighlightUri('i=http://yt.127.0.0.1.xip.io:28080/assets/zwartevilt.png&t=50s')
      .end();
  },

  'Autosize of Image player' : function (browser) {
    browser
      .resizeWindow(640,360)
      .page.looper()
      .uri('#i=http://yt.127.0.0.1.xip.io:28080/assets/zwartevilt.png&i=http://yt.127.0.0.1.xip.io:28080/favicon.ico')
      .waitForElementVisible('div#player')
      .pause(800) //wait for animation to finish
      .getElementSize('#player', function(result) {
        console.log('[png] For 640x360 window Image player');
        this.assert.equal(result.value.width, 453);
        this.assert.equal(result.value.height, 288);
      })
      .resizeWindow(1920,1080)
      .pause(800) //wait for animation to finish
      .getElementSize('#player', function(result) {
        console.log('[png] For 1920x1080 window Image player');
        this.assert.equal(result.value.width, 1361);
        this.assert.equal(result.value.height, 864);
      })
      .resizeWindow(640,360)
      .keys('j')
      .waitForElementPresent('div#player')
      .pause(800) //wait for animation to finish
      .getElementSize('#player', function(result) {
        console.log('[ico] For 640x360 window Image player');
        this.assert.equal(result.value.width, 288);
        this.assert.equal(result.value.height, 288);
      })
      .resizeWindow(1920,1080)
      .pause(800) //wait for animation to finish
      .getElementSize('#player', function(result) {
        console.log('[ico] For 1920x1080 window Image player fits inside of 1280x720');
        this.assert.equal(result.value.width, 864);
        this.assert.equal(result.value.height, 864);
      })
      .end();
  },

};
