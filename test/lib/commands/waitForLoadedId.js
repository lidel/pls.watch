module.exports.command = function (expectedId) {
  return this.waitForAttribute('#box', 'data-loaded-id', (id) => id === expectedId);
};

