var yeahKindaSame = function(value, expected) {
  // these iframe apis are maddness: each load can differ a few pixels..
  // generally we hide overflow, so I guess there is no point in being
  // facist about it and we should simply accept anything around the expected
  // value (+/- 10px)
  var max = expected+10;
  var min = expected-10;
  return value >= min && value <= max;
};


module.exports = {

  'There should be no GUIi beside small icon' : function (browser) {
    browser
      .page.embed().uri('#i=50yPd6G')
      .waitForElementVisible('div#player')
      .waitForElementNotPresent('#help')
      .waitForElementNotPresent('#menu')
      .waitForElementNotPresent('#editor')
      .waitForElementPresent('a#embed')
      .getAttribute('a#embed', 'href', function(result) {
        this.assert.ok(result.value.indexOf('#i=50yPd6G') > -1, '#embed link match loaded iframe');
      })
      .end();
  },

  'YouTube Player size in IFrame' : function (browser) {
    browser
      .page.embed().uri('#v=T0rs3R4E1Sk&t=23;30')
      .waitForElementVisible('iframe#player')
      .getElementSize('#player', function(result) {
        this.assert.ok(yeahKindaSame(result.value.width,  420),'around 420px');
        this.assert.ok(yeahKindaSame(result.value.height, 315),'around 315px');
      })
      .end();
  },

  'Imgur Player size in IFrame' : function (browser) {
    browser
      .page.embed().uri('#i=vo9DPpp.gif')
      .waitForElementVisible('div#player')
      .getElementSize('#player', function(result) {
        this.assert.ok(yeahKindaSame(result.value.width,  420),'around 420px');
        this.assert.ok(yeahKindaSame(result.value.height, 315),'around 315px');
      })
      .end();
  },

  'SoundCloudPlayer size in IFrame' : function (browser) {
    browser
      .page.embed().uri('#s=sacredbones/pharmakon-body-betrays-itself')
      .waitForElementVisible('iframe#player')
      .getElementSize('#player', function(result) {
        this.assert.ok(yeahKindaSame(result.value.width,  420),'around 420px');
        this.assert.ok(yeahKindaSame(result.value.height, 315),'around 315px');
      })
      .end();
  },

};
