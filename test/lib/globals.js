'use strict';

module.exports = {
  get skipOnTravis () {
    // https://github.com/lidel/pls.watch/issues/166
    return ('TRAVIS' in process.env && 'CI' in process.env);
  }

};
