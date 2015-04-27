exports.assertion = function(expectedUri) {
  this.expected = expectedUri;
  this.message = 'Testing if data-interval-uri of #editor highlight equals "' + this.expected + '"';

  this.pass = function(value) {
    return value === this.expected;
  };

  this.value = function(result) {
    return result.value;
  };

  this.command = function(callback) {
    this.api.getAttribute('#editor .highlighted td.editor-col2 a', 'data-interval-uri', callback);
    return this;
  };
};
