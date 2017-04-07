module.exports = {

  /* does not work in phantomjs 
  'Autosize of YouTube video' : function (browser) {
    if (browser.globals.skipOnTravis) return;
    browser
      .page.looper()
      .uri('#i=TR4iupB.jpg')
      .waitForAttribute('#box', 'data-loaded-id', (id) => id === 'T0rs3R4E1Sk')
      .resizeWindow(640,360)
      .pause(800)
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
      .end();
  },
  */

  'Playlist Import with deduplication and recalculated index' : function (browser) {
    if (browser.globals.skipOnTravis) return;
    if (browser.options.desiredCapabilities.browserName === 'phantomjs') return;
    browser
      .page.looper()
      .uri('#index=13&list=PLyALKMPGOR5evINIHBRgtioZBuujYFaeS&editor')
      .waitForElementVisible('iframe#player')
      .waitForElementVisible('#editor .highlighted')
      .assert.uriEquals('#index=13&v=nJBxKT7EGKI&v=eRs_U6eYl-c&v=cWn9JN4gSsk&v=vnncm3MbMLs&v=3Hv1DElPXV0&v=PLb57RNlqJc&v=S0COlNTizwo&v=phrRu6lACcE&v=FGs57y4nA_Y&v=U8-rNMPTnyg&v=XCzdTxRBDW8&v=wY-kAnvOY80&v=QaLFAlUp1U8&v=4bnb8ti0JGU&v=uxp54wEhQi8&v=RyZU9ptzy68&v=vCVN5pLXoo4&v=jA8inmHhx8c&v=GINpKSkZawk&v=qk2_IY9w4Og&v=_G04b2sZvSM&v=rLrtEyisDMU&editor')
      .assert.editorHighlightUri('v=QaLFAlUp1U8')
      .page.looper()
      .uri('#v=eRs_U6eYl-c&v=cWn9JN4gSsk&v=ZNno63ZO2Lw&index=14&list=PLyALKMPGOR5evINIHBRgtioZBuujYFaeS&editor')
      .waitForLoadedId('4bnb8ti0JGU')
      .waitForElementVisible('#editor .highlighted')
      .waitForElementVisible('iframe#player')
      .assert.editorHighlightUri('v=4bnb8ti0JGU')
      .assert.uriEquals('#v=eRs_U6eYl-c&v=cWn9JN4gSsk&v=ZNno63ZO2Lw&index=17&v=nJBxKT7EGKI&v=eRs_U6eYl-c&v=cWn9JN4gSsk&v=vnncm3MbMLs&v=3Hv1DElPXV0&v=PLb57RNlqJc&v=S0COlNTizwo&v=phrRu6lACcE&v=FGs57y4nA_Y&v=U8-rNMPTnyg&v=XCzdTxRBDW8&v=wY-kAnvOY80&v=QaLFAlUp1U8&v=4bnb8ti0JGU&v=uxp54wEhQi8&v=RyZU9ptzy68&v=vCVN5pLXoo4&v=jA8inmHhx8c&v=GINpKSkZawk&v=qk2_IY9w4Og&v=_G04b2sZvSM&v=rLrtEyisDMU&editor')
      .page.looper()
      .uri('#list=PLyALKMPGOR5evINIHBRgtioZBuujYFaeS&index=13&editor')
      .waitForLoadedId('QaLFAlUp1U8')
      .waitForElementVisible('#editor .highlighted')
      .waitForElementVisible('iframe#player')
      .assert.editorHighlightUri('v=QaLFAlUp1U8')
      .assert.uriEquals('#v=nJBxKT7EGKI&v=eRs_U6eYl-c&v=cWn9JN4gSsk&v=vnncm3MbMLs&v=3Hv1DElPXV0&v=PLb57RNlqJc&v=S0COlNTizwo&v=phrRu6lACcE&v=FGs57y4nA_Y&v=U8-rNMPTnyg&v=XCzdTxRBDW8&v=wY-kAnvOY80&v=QaLFAlUp1U8&v=4bnb8ti0JGU&v=uxp54wEhQi8&v=RyZU9ptzy68&v=vCVN5pLXoo4&v=jA8inmHhx8c&v=GINpKSkZawk&v=qk2_IY9w4Og&v=_G04b2sZvSM&v=rLrtEyisDMU&index=13&editor')
      .page.looper()
      .uri('#v=eRs_U6eYl-c&v=cWn9JN4gSsk&v=ZNno63ZO2Lw&list=PLyALKMPGOR5evINIHBRgtioZBuujYFaeS&index=12&editor')
      .waitForLoadedId('wY-kAnvOY80')
      .waitForElementVisible('#editor .highlighted')
      .waitForElementVisible('iframe#player')
      .assert.editorHighlightUri('v=wY-kAnvOY80')

      .end();
  },

};
