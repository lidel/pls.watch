module.exports = function(grunt) {
  grunt.initConfig({
    qunit: {
      files: ['test/index.html'],
      options: {
        timeout: 30000,
      }
    },
    jshint: {
      all: ['*.js', 'test/**/*.js'],
      options: {
        'jquery': true,
        'quotmark': 'single',
        'white': true,
        'indent': 2,
        'latedef': true,
        'unused': true,
        '-W014': true, // ignore [W014] Bad line breaking
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', 'travis');
  grunt.registerTask('test', 'qunit');
  // Travis CI task.
  grunt.registerTask('travis', ['test','jshint']);
};
// vim:ts=2:sw=2:et:
