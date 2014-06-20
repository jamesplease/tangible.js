module.exports = function(grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Pass in the theme via `grunt --theme=mytheme`; defaults to 'tomorrow'
  var theme = grunt.option('theme') || 'tomorrow';

  grunt.initConfig({

    clean: ['.tmp', 'build'],

    preprocess: {
      js: {
        src:  'source/js/wrapper.js',
        dest: '.tmp/tangible.js'
      },
      less: {
        options: {
          context: {
            THEME: theme
          }
        },
        src: 'source/less/style.less',
        dest: '.tmp/tangible.less'
      }
    },

    processor: {
      options: {
        data: {
          style: '<%= less.base.dest %>'
        }
      },
      injector: {
        src: 'source/js/injector/injector.js',
        dest: '.tmp/injector.js'
      }
    },

    jshint: {
      options: {
        '-W086': true,
        '-W064': true,
        'jshintrc': true
      },
      main: {
        src: '<%= preprocess.js.dest %>'
      }
    },

    uglify: {
      core: {
        src:  '<%= preprocess.js.dest %>',
        dest: 'build/tangible.js'
      },
      bundle: {
        src:  ['<%= preprocess.js.dest %>', 'bower_components/fast-json-patch/src/json-patch-duplex.js'],
        dest: 'build/tangible.bundle.js'
      }
    },

    less: {
      options: {
        paths: ['source/less', 'themes'],
        cleancss: true
      },
      base: {
        src:  '<%= preprocess.less.dest %>',
        dest: '.tmp/tangible.css'
      }
    }
  });

  grunt.registerMultiTask('processor', 'Processes JS files as Lo Dash templates', function() {

    var
    options   = this.options(),
    template  = grunt.file.read(this.data.src),
    style     = grunt.file.read(options.data.style),
    variables = { style: style };

    template = grunt.template.process(template, { data: variables });
    grunt.file.write(this.data.dest, template);

  });

  // Build the default theme: Tomorrow (light)
  grunt.registerTask('default', ['clean', 'preprocess:less', 'less', 'processor', 'preprocess:js', 'jshint', 'uglify']);
};
