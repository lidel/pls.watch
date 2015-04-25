exports.assertion = function(expectedUri) {
  this.expected = expectedUri;
  this.message = 'Testing if the URI equals "' + this.expected + '"';

  this.pass = function(value) {
    return value === this.expected;
  };

  this.value = function(result) {
    return result.value.replace(/http:\/\/yt\.127\.0\.0\.1\.xip\.io:28080\/?/,'');
  };

  this.command = function(callback) {
    this.api.url(callback);
    return this;
  };
};
