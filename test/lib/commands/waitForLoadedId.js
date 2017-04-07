module.exports.command = function (expectedId) {
  return this.waitForAttribute('#box', 'data-loaded-id', (id) => {
    let result = (id === expectedId);
    if (!result) {
      console.log('invalid data-loaded-id=', id);
     }
    return result;
  });
};

