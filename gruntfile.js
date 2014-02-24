module.exports = function( grunt ) {

  require( 'matchdep' ).filterDev( 'grunt-*' ).forEach( grunt.loadNpmTasks );

  // Pass in the theme via `grunt --theme=mytheme`; defaults to 'tomorrow'
  var theme = grunt.option('theme') || 'tomorrow';

  grunt.initConfig({

    clean: [ '.tmp', 'build' ],

    preprocess: {
      js: {
        src:   'source/js/wrapper.js',
        dest: '.tmp/visual-json.js'
      },
      less: {
        options: {
          context: {
            THEME: theme
          }
        },
        src: 'source/less/style.less',
        dest: '.tmp/visual-json.less'
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
        paths: [ 'source/less', 'themes' ],
      },
      base: {
        src:  '<%= preprocess.less.dest %>',
        dest: 'build/virtual-json.css'
      }
    }

  });

  // Build the default theme: Tomorrow (light)
  grunt.registerTask( 'default', ['clean', 'preprocess', 'jshint', 'uglify', 'less:'] );

};