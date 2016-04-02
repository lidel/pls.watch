'use strict';

module.exports = {
  get skipOnTravis () {
    // https://github.com/lidel/yt-looper/issues/166
    return ('TRAVIS' in process.env && 'CI' in process.env);
  }
};
