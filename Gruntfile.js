module.exports = function(grunt) {
  var nightwatch = require('nightwatch');
  nightwatch.initGrunt(grunt);


  grunt.initConfig({
    connect: {
      server: {
        options: {
          hostname: 'yt.127.0.0.1.xip.io',
          port: 28080,
          base: '.'
        },
      },
    },
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
    env: {
      options: {
        concat: {
          PATH: {
            'value': 'node_modules/.bin',
            'delimiter': ':'
          },
        },
      },
      test: {
        options: {
          concat: {
            PATH: {
              'value': '../node_modules/.bin',
              'delimiter': ':'
            },
          },
        },
      },
    },
  });

  grunt.registerTask('selenium', 'Download Selenium Standalone Server', function() {
    var done = this.async();
    var selenium = require('selenium-standalone');

    selenium.install({
      version: '2.45.0',
      baseURL: 'http://selenium-release.storage.googleapis.com',
      drivers: {
        chrome: {
          version: '2.15',
          arch: process.arch,
          baseURL: 'http://chromedriver.storage.googleapis.com'
        }
      },

      logger: function(message) {
        grunt.verbose.writeln(message);
      },

      progressCb: function(total, progress, chunk) { /*jshint ignore:line*/
        grunt.log.write('\rDownloading Selenium.. '+Math.round(progress/total*100)+'%');
      }

    }, done);

  });

  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('default', 'travis');

  grunt.registerTask('test',    ['env', 'qunit', 'env:test', 'connect', 'selenium', 'nightwatch:phantomjs']);
  grunt.registerTask('firefox', ['env', 'qunit', 'env:test', 'connect', 'selenium', 'nightwatch:firefox']);
  grunt.registerTask('chrome',  ['env', 'qunit', 'env:test', 'connect', 'selenium', 'nightwatch:chrome']);

  grunt.registerTask('travis',  ['env', 'jshint', 'test']);

  grunt.registerTask('httpd', 'connect:server:keepalive');


};
// vim:ts=2:sw=2:et:
