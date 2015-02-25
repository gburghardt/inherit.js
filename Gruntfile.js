module.exports = function(grunt) {

  var files = grunt.file.readJSON('build/files.json');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      main: {
        src: ["src/Base.js"],
        dest: 'dist/<%= pkg.name %>.concat.js'
      }
    },
    min: {
      main: {
        src: 'dist/<%= pkg.name %>.concat.js',
        dest: 'dist/<%= pkg.name %>.min.js',
      }
    }
  });

  // Load the plugin that provides the "concat" task.
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Load the plugin that provides the "min" task.
  grunt.loadNpmTasks('grunt-yui-compressor');

  // Default task(s).
  grunt.registerTask('default', ['concat', 'min']);

};