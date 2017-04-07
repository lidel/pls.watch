module.exports = {

  'There should be no GUI beside small icon' : function (browser) {
    browser
      .page.embed().uri('#i=50yPd6G')
      .waitForLoadedId('50yPd6G')
      .waitForElementNotPresent('#help')
      .waitForElementNotPresent('#menu')
      .waitForElementNotPresent('#editor')
      .waitForElementPresent('a#embed')
      .getAttribute('a#embed', 'href', function(result) {
        this.assert.ok(result.value.indexOf('#i=50yPd6G') > -1, '#embed link match loaded iframe');
      })
      .end();
  },

  /* TODO
  'YouTube Player size in IFrame' : function (browser) {
    browser
      .page.embed().uri('#i=TR4iupB.jpg&editor')
      .assert.cssClassPresent('#box', 'embedded')
      .assert.editorHighlightUri('i=TR4iupB.jpg')
      .end();
  },
  */

  'Imgur Player size in IFrame' : function (browser) {
    browser
      .page.embed().uri('#i=vo9DPpp.gif')
      .waitForLoadedId('vo9DPpp.gif')
      .assert.cssClassPresent('#box', 'embedded')
      .end();
  },

  'SoundCloudPlayer size in IFrame' : function (browser) {
    if (browser.globals.skipOnTravis) return;
    browser
      .page.embed().uri('#s=sacredbones/pharmakon-body-betrays-itself')
      .waitForLoadedId('sacredbones/pharmakon-body-betrays-itself')
      .assert.cssClassPresent('#box', 'embedded')
      .end();
  },

  /* PhantomJS does not suppor <video> as of now 
  'HTML5 Player size in IFrame' : function (browser) {
    browser
      .page.embed().uri('#v=https://vt.tumblr.com/tumblr_npa1dkYP1U1urdxm4.mp4&t=1s;8s')
      .waitForElementVisible('div#player')
      .assert.cssClassPresent('#box', 'embedded')
      .end();
  },
  */

};
