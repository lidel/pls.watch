module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  require('nightwatch').initGrunt(grunt);

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
      all: {
        options: {
          urls: ['http://yt.127.0.0.1.xip.io:28080/test/headless/index.html'],
          timeout: 30000
        }
      }
    },
    purifycss: {
      options: {},
      target: {
        src: ['*.html', 'yt-looper*.js'],
        css: ['*.css'],
        dest: 'pure_style.css'
      },
    },
    eslint: {
      target: ['*.js', 'test/**/*.js']
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
      version: '2.48.2',
      baseURL: 'http://selenium-release.storage.googleapis.com',
      drivers: {
        chrome: {
          version: '2.20',
          arch: process.arch,
          baseURL: 'http://chromedriver.storage.googleapis.com'
        }
      },

      logger: function(message) {
        grunt.verbose.writeln(message);
      },

      progressCb: function(total, progress, chunk) { // eslint-disable-line no-unused-vars
        grunt.log.write('\rDownloading Selenium.. '+Math.round(progress/total*100)+'%');
      }

    }, done);

  });

  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-purifycss');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('default', 'test');
  grunt.registerTask('common',  ['env', 'eslint', 'connect', 'qunit', 'env:test', 'selenium']);

  grunt.registerTask('test',    ['common', 'nightwatch:phantomjs']);
  grunt.registerTask('firefox', ['common', 'nightwatch:firefox']);
  grunt.registerTask('chrome',  ['common', 'nightwatch:chrome']);

  grunt.registerTask('httpd', 'connect:server:keepalive');


};
// vim:ts=2:sw=2:et:
