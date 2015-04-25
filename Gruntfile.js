module.exports = function(grunt) {
  var nightwatch = require('nightwatch');
  nightwatch.initGrunt(grunt);

  grunt.initConfig({
    nightwatch: {
      options: {
        cwd: './test/'
      },
      'default': {},
      'firefox': {
        argv: {
          env: 'firefox',
        },
      },
      'chrome': {
        argv: {
          env: 'chrome',
        },
      },
      'phantomjs': {
        argv: {
          env: 'phantomjs',
        },
      },
      'all': {
        argv: {
          env: 'firefox,chrome,phantomjs',
        },
      }
    },
    qunit: {
      files: ['test/headless/index.html'],
      options: {
        timeout: 30000,
      }
    },
    jshint: {
      all: ['*.js', 'test/headless/*.js', 'test/gui/*.js'],
      options: {
        'jquery': true,
        'quotmark': 'single',
        'white': true,
        'indent': 2,
        'latedef': true,
        'unused': true,
        '-W014': true, // ignore [W014] Bad line breaking
        '-W097': true, // global strict
        'predef':[
          'jQuery',
          'window',
          'console',
          'document',
          '$LAB',
          '$',
          '_',
          ],
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', 'travis');
  grunt.registerTask('test', ['qunit', 'nightwatch:phantomjs']);
  grunt.registerTask('travis', ['jshint', 'test']);
};
// vim:ts=2:sw=2:et:
