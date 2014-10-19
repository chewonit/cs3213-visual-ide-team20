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
    clean: ['build/'],
    connect: {
      development: {
        options: {
          base: ['<%= build_path.active %>', '.'],
          hostname: 'localhost',
          livereload: true,
          open: true
        }
      }
    },
    copy: {
      html: {
        files: [{
          expand: true,
          src: ['*.html'],
          dest: '<%= build_path.active %>'
        }]
      },
      js: {
        files: [{
          expand: true,
          src: ['js/**'],
          dest: '<%= build_path.active %>'
        }]
      },
      img: {
        files: [{
          expand: true,
          src: ['img/**'],
          dest: '<%= build_path.active %>'
        }]
      },
      bower: {
        files: [{
          expand: true,
          src: ['bower_components/**'],
          dest: '<%= build_path.active %>'
        }]
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'js/**/*.js']
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
          'wiredep',
          'copy:html'
        ]
      },
      js: {
        files: ['js/**'],
        tasks: [
          'set-active-build-path:<%= build_config %>',
          'jshint',
          'copy:js'
        ]
      },
      css: {
        files: ['**/*.scss'],
        tasks: [
          'set-active-build-path:<%= build_config %>',
          'sass:<%= build_config %>'
        ]
      },
      img: {
        files: ['img/**'],
        tasks: [
          'set-active-build-path:<%= build_config %>',
          'copy:img'
        ]
      }
    },
    wiredep: {
      all: {
        src: ['*.html', 'css/*.scss']
      }
    }
  });
  
  // Load grunt tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-wiredep');
  
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
    'wiredep',
    'sass:production',
    'jshint',
    'copy'
  ]);
  
  // Serves the build directory.
  grunt.registerTask('serve', [
    'set-active-build-path:development',
    'wiredep',
    'sass:development',
    'jshint',
    'connect',
    'watch'
  ]);
  
  // The default task.
  grunt.registerTask('default', [
    'set-active-build-path:development',
    'wiredep',
    'sass:development',
    'jshint',
    'copy'
  ]);
};
