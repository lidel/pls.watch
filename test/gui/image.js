module.exports = {

  'Player with single Image interval (png)' : function (browser) {
    browser
      .page.looper()
      .uri('#i=http://127.0.0.1:28080/assets/zwartevilt.png&t=50s&editor')
      .waitForElementVisible('div#player img')
      .waitForElementVisible('#editor .highlighted')
      .assert.editorHighlightUri('i=http://127.0.0.1:28080/assets/zwartevilt.png&t=50s')
      .end();
  },

  'Player with single Image from IPFS' : function (browser) {
    //if (browser.globals.skipOnTravis) return;
    browser
      .page.looper()
      .uri('#i=/ipfs/QmYHNYAaYK5hm3ZhZFx5W9H6xydKDGimjdgJMrMSdnctEm&editor')
      .waitForElementVisible('#editor .highlighted')
      .assert.editorHighlightUri('i=/ipfs/QmYHNYAaYK5hm3ZhZFx5W9H6xydKDGimjdgJMrMSdnctEm')
      .end();
  },


  'Autosize of Image player' : function (browser) {
    //if (browser.globals.skipOnTravis) return;
    browser
      .page.looper()
      .uri('#i=http://127.0.0.1:28080/assets/zwartevilt.png&i=https://i.imgur.com/TR4iupB.jpg&editor')
      .waitForElementVisible('#editor .highlighted')
      .waitForLoadedId('http://127.0.0.1:28080/assets/zwartevilt.png')
      .resizeWindow(640,360)
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
      .waitForLoadedId('TR4iupB.jpg')
      .pause(800) //wait for animation to finish
      .getElementSize('#player', function(result) {
        console.log('[png2] For 640x360 window Image player');
        this.assert.equal(result.value.width, 318);
        this.assert.equal(result.value.height, 288);
      })
      .resizeWindow(1920,1080)
      .waitForElementVisible('div#player img')
      .pause(800) //wait for animation to finish
      .getElementSize('#player', function(result) {
        console.log('[png2] For 1920x1080 window Image player fits inside of 1280x720');
        this.assert.equal(result.value.width, 954);
        this.assert.equal(result.value.height, 864);
      })
      .end();
  },

};
