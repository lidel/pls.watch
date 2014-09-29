module.exports = function(grunt) {
  grunt.initConfig({
    qunit: {
      files: ['test/index.html']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-qunit');

  // Default task.
  grunt.registerTask('test', 'qunit');
  // Travis CI task.
  grunt.registerTask('travis', 'test');
};
// vim:ts=2:sw=2:et:
