module.exports = {

  'Autosize of YouTube video' : function (browser) {
    browser
      .resizeWindow(640,360)
      .page.looper()
      .uri('#v=T0rs3R4E1Sk&t=23;30')
      .waitForElementVisible('iframe#player')
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

  'Playlist Import with deduplication and recalculated index' : function (browser) {
    browser
      .page.looper()
      .uri('#index=13&list=PLyALKMPGOR5evINIHBRgtioZBuujYFaeS')
      .waitForElementVisible('iframe#player')
      .assert.uriEquals('#index=13&v=nJBxKT7EGKI&v=eRs_U6eYl-c&v=cWn9JN4gSsk&v=vnncm3MbMLs&v=3Hv1DElPXV0&v=PLb57RNlqJc&v=S0COlNTizwo&v=phrRu6lACcE&v=FGs57y4nA_Y&v=U8-rNMPTnyg&v=XCzdTxRBDW8&v=wY-kAnvOY80&v=QaLFAlUp1U8&v=4bnb8ti0JGU&v=uxp54wEhQi8&v=RyZU9ptzy68&v=vCVN5pLXoo4&v=jA8inmHhx8c&v=GINpKSkZawk&v=qk2_IY9w4Og&v=_G04b2sZvSM&v=rLrtEyisDMU')
      .keys('e')
      .waitForElementVisible('#editor .highlighted')
      .assert.editorHighlightUri('v=QaLFAlUp1U8')
      .page.looper()
      .uri('#v=eRs_U6eYl-c&v=cWn9JN4gSsk&v=ZNno63ZO2Lw&index=14&list=PLyALKMPGOR5evINIHBRgtioZBuujYFaeS')
      .waitForElementVisible('iframe#player')
      .assert.uriEquals('#v=eRs_U6eYl-c&v=cWn9JN4gSsk&v=ZNno63ZO2Lw&index=17&v=nJBxKT7EGKI&v=eRs_U6eYl-c&v=cWn9JN4gSsk&v=vnncm3MbMLs&v=3Hv1DElPXV0&v=PLb57RNlqJc&v=S0COlNTizwo&v=phrRu6lACcE&v=FGs57y4nA_Y&v=U8-rNMPTnyg&v=XCzdTxRBDW8&v=wY-kAnvOY80&v=QaLFAlUp1U8&v=4bnb8ti0JGU&v=uxp54wEhQi8&v=RyZU9ptzy68&v=vCVN5pLXoo4&v=jA8inmHhx8c&v=GINpKSkZawk&v=qk2_IY9w4Og&v=_G04b2sZvSM&v=rLrtEyisDMU')
      .assert.editorHighlightUri('v=4bnb8ti0JGU')
      .page.looper()
      .uri('#list=PLyALKMPGOR5evINIHBRgtioZBuujYFaeS&index=13')
      .waitForElementVisible('iframe#player')
      .assert.uriEquals('#v=nJBxKT7EGKI&v=eRs_U6eYl-c&v=cWn9JN4gSsk&v=vnncm3MbMLs&v=3Hv1DElPXV0&v=PLb57RNlqJc&v=S0COlNTizwo&v=phrRu6lACcE&v=FGs57y4nA_Y&v=U8-rNMPTnyg&v=XCzdTxRBDW8&v=wY-kAnvOY80&v=QaLFAlUp1U8&v=4bnb8ti0JGU&v=uxp54wEhQi8&v=RyZU9ptzy68&v=vCVN5pLXoo4&v=jA8inmHhx8c&v=GINpKSkZawk&v=qk2_IY9w4Og&v=_G04b2sZvSM&v=rLrtEyisDMU&index=13')
      .assert.editorHighlightUri('v=QaLFAlUp1U8')
      .page.looper()
      .uri('#v=eRs_U6eYl-c&v=cWn9JN4gSsk&v=ZNno63ZO2Lw&list=PLyALKMPGOR5evINIHBRgtioZBuujYFaeS&index=13')
      .waitForElementVisible('iframe#player')
      .assert.uriEquals('#v=eRs_U6eYl-c&v=cWn9JN4gSsk&v=ZNno63ZO2Lw&v=nJBxKT7EGKI&v=eRs_U6eYl-c&v=cWn9JN4gSsk&v=vnncm3MbMLs&v=3Hv1DElPXV0&v=PLb57RNlqJc&v=S0COlNTizwo&v=phrRu6lACcE&v=FGs57y4nA_Y&v=U8-rNMPTnyg&v=XCzdTxRBDW8&v=wY-kAnvOY80&v=QaLFAlUp1U8&v=4bnb8ti0JGU&v=uxp54wEhQi8&v=RyZU9ptzy68&v=vCVN5pLXoo4&v=jA8inmHhx8c&v=GINpKSkZawk&v=qk2_IY9w4Og&v=_G04b2sZvSM&v=rLrtEyisDMU&index=16')
      .assert.editorHighlightUri('v=QaLFAlUp1U8')
      .end();
  },

};
