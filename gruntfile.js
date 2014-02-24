module.exports = function( grunt ) {

  require( 'matchdep' ).filterDev( 'grunt-*' ).forEach( grunt.loadNpmTasks );

  grunt.initConfig({

    clean: [ '.tmp', 'build' ],

    preprocess: {
      js: {
        src:   'source/js/wrapper.js',
        dest: '.tmp/visual-json.js'
      },
      tomorrow: {
        options: {
          context: {
            THEME: 'tomorrow'
          }
        },
        src: 'source/less/style.less',
        dest: './tmp/visual-json.less'
      }
    },

    jshint: {
      main: {
        src: '<%= preprocess.js.dest %>'
      }
    },

    uglify: {
      build: {
        src:  '<%= preprocess.js.dest %>',
        dest: 'build/visual-json.js'
      }
    },

    less: {
      options: {
        paths: 'source/less',
        context: {
          THEME: 'tomorrow'
        }
      },
      base: {
        src:  '<%= preprocess.less.dest %>',
        dest: 'build/virtual-json.css'
      }
    }

  });



  // Build the default theme: Tomorrow (light)
  grunt.registerTask( 'default', ['prebuild', 'preprocess:tomorrow', 'build'] );

  // Build other themes
  grunt.registerTask( 'default', ['prebuild', 'preprocess:tomorrow', 'build'] );

  // The tasks that wrap setting the theme
  grunt.registerTask( 'prebuild', [ 'clean', 'preprocess:js'   ] );
  grunt.registerTask( 'build',    [ 'jshint', 'uglify', 'less' ] );

};