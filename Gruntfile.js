/**
 * CS3213 Software Systems Design - Team 20
 * National University of Singapore
 *
 * Gruntfile for VisualIDE.
 */

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    build_path: {
      development: 'build/development',
      production: 'build/production'
    },
    connect: {
      development: {
        options: {
          base: '<%= build_path.active %>',
          hostname: 'localhost',
          livereload: true,
          open: true
        }
      }
    },
    copy: {
      development: {
        files: [{
          expand: true,
          src: ['*.html', 'js/**'],
          dest: '<%= build_path.active %>'
        }]
      },
      production: {
        files: [{
          expand: true,
          src: ['*.html', 'js/**'],
          dest: '<%= build_path.active %>'
        }]
      }
    },
    sass: {
      development: {
        options: {
          outputStyle: 'nested'
        },
        files: [{
          expand: true,
          src: ['css/*.scss'],
          dest: '<%= build_path.active %>',
          ext: '.css',
          extDot: 'first'
        }]
      },
      production: {
        options: {
          // Disabled for now, see https://github.com/sindresorhus/grunt-sass/issues/122
          // sourceMap: true,
          outputStyle: 'compressed'
        },
        files: [{
          expand: true,
          src: ['css/*.scss'],
          dest: '<%= build_path.active %>',
          ext: '.css',
          extDot: 'first'
        }]
      }
    },
    watch: {
      livereload: {
        files: ['<%= build_path.active %>/**'],
        options: {
          livereload: true
        }
      },
      html: {
        files: ['*.html'],
        tasks: [
          'set-active-build-path:<%= build_config %>',
          'copy:<%= build_config %>'
        ]
      },
      css: {
        files: ['**/*.scss'],
        tasks: [
          'set-active-build-path:<%= build_config %>',
          'sass:<%= build_config %>'
        ]
      }
    }
  });
  
  // Load grunt tasks.
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');
  
  // Task to determine which build path to use.
  grunt.registerTask('set-active-build-path', 'Sets the active build path.',
    function (buildConfig) {
      grunt.config('build_config', grunt.config('build_config', buildConfig));
      grunt.config('build_path.active', grunt.config('build_path.' + buildConfig));
    }
  );
  
  // Generates files for production.
  grunt.registerTask('dist', [
    'set-active-build-path:production',
    'sass:production',
    'copy'
  ]);
  
  // Serves the build directory.
  grunt.registerTask('serve', [
    'set-active-build-path:development',
    'sass:development',
    'copy',
    'connect',
    'watch'
  ]);
  
  // The default task.
  grunt.registerTask('default', [
    'set-active-build-path:development',
    'sass:development',
    'copy'
  ]);
};
