module.exports = {

  'Editor drag&drop should trigger URL update' : function (browser) {
    //if (browser.globals.skipOnTravis) return;
    browser
      .resizeWindow(640,360)
      .page.looper()
      .uri('#index=3&v=nJBxKT7EGKI&i=TR4iupB.jpg&i=cJjBEQP&v=vnncm3MbMLs&v=3Hv1DElPXV0&v=PLb57RNlqJc&v=S0COlNTizwo&v=phrRu6lACcE&v=FGs57y4nA_Y&v=U8-rNMPTnyg&v=XCzdTxRBDW8&v=wY-kAnvOY80&v=QaLFAlUp1U8&v=4bnb8ti0JGU&v=uxp54wEhQi8&v=RyZU9ptzy68&v=vCVN5pLXoo4&v=jA8inmHhx8c&v=GINpKSkZawk&v=qk2_IY9w4Og&v=_G04b2sZvSM&v=rLrtEyisDMU&quality=small&editor')
      .waitForElementVisible('#editor .highlighted')
      .assert.editorHighlightUri('i=cJjBEQP')
      .waitForLoadedId('cJjBEQP')
      .assert.uriEquals('#index=3&v=nJBxKT7EGKI&i=TR4iupB.jpg&i=cJjBEQP&v=vnncm3MbMLs&v=3Hv1DElPXV0&v=PLb57RNlqJc&v=S0COlNTizwo&v=phrRu6lACcE&v=FGs57y4nA_Y&v=U8-rNMPTnyg&v=XCzdTxRBDW8&v=wY-kAnvOY80&v=QaLFAlUp1U8&v=4bnb8ti0JGU&v=uxp54wEhQi8&v=RyZU9ptzy68&v=vCVN5pLXoo4&v=jA8inmHhx8c&v=GINpKSkZawk&v=qk2_IY9w4Og&v=_G04b2sZvSM&v=rLrtEyisDMU&quality=small&editor')
      .moveToElement('#editor .highlighted',3,3)
      .mouseButtonDown('left')
      .moveToElement('#editor table', 10, 3)
      .mouseButtonUp('left')
      .pause(200)
      .waitForLoadedId('TR4iupB.jpg')
      .assert.editorHighlightUri('i=TR4iupB.jpg')
      .assert.uriEquals('#i=cJjBEQP&v=nJBxKT7EGKI&i=TR4iupB.jpg&v=vnncm3MbMLs&v=3Hv1DElPXV0&v=PLb57RNlqJc&v=S0COlNTizwo&v=phrRu6lACcE&v=FGs57y4nA_Y&v=U8-rNMPTnyg&v=XCzdTxRBDW8&v=wY-kAnvOY80&v=QaLFAlUp1U8&v=4bnb8ti0JGU&v=uxp54wEhQi8&v=RyZU9ptzy68&v=vCVN5pLXoo4&v=jA8inmHhx8c&v=GINpKSkZawk&v=qk2_IY9w4Og&v=_G04b2sZvSM&v=rLrtEyisDMU&editor&index=3&quality=small')
      .end();
  },

};
