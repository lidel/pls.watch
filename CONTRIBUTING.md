# Contributing

## Work on existing issues

Feel free to work on issues that are [not assigned yet](https://github.com/lidel/yt-looper/issues?utf8=✓&q=is%3Aissue+is%3Aopen+no%3Aassignee).
As a courtesy, please add a comment informing  about your intent.


## Create new issues

Do not hesitate and [create a new issue](https://github.com/lidel/yt-looper/issues/new)
if you see a bug, a room for improvement or simply have a question.

# Tests

Make sure your changes follow code style and pass basic suite of regression tests.

To install all dependencies into local directory named `node_modules` and run test suite (`grunt test`), simply execute (Node 0.10):


```bash
npm install && npm test

```

By default tests (including GUI ones) run in headless mode under [PhantomJS](http://phantomjs.org/).
Local HTTP server is spawned automatically for the lifetime of test suite task.

To run test suite under a specific browser:

- `grunt firefox`
- `grunt chrome`

To start simple HTTP server manually:
(`yt.127.0.0.1.xip.io` should point to `127.0.0.1`)

- `grunt httpd`

To check code style:

- `grunt jshint`
