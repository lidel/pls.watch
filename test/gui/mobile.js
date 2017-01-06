module.exports = {

  'There should be no GUI' : function (browser) {
    browser
      .page.mobile().uri('#i=50yPd6G')
      .waitForLoadedId('50yPd6G')
      .waitForElementNotPresent('#help')
      .waitForElementNotPresent('#menu')
      .waitForElementNotPresent('#editor')
      .waitForElementNotPresent('a#embed')
      .assert.cssClassPresent('#box', 'mobile')
      .end();
  }

};
