module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    react: {
      jsx: {
        files: [{
            expand: true,
            cwd: 'app/jsx',
            src: ['**/*.jsx', '**/**/*.jsx'],
            dest: 'build/jsx',
            ext: '.js'
        }]
      }
    },

    concat: {
      html: {
        src: ['app/templates/*.html'],
        dest: 'build/templates.html'
      },
      js: {
        src: ['app/js/**/*.js', 'build/jsx/**/*.js'],
        dest: 'build/scripts.js',
      }
    },

    replace: {
      templates: {
        options: {processTemplates: false},
        src: ['app/index.html'],
        dest: 'build/',
        replacements: [{
          from: '<!-- TEMPLATES -->',
          to: function () {
            var templates = '';
            try { templates = grunt.file.read('./build/templates.html'); }
            catch (e) { console.log(e); }
            return templates;
          }
        }]
      }
    },

    less: {
      css: {
        files: {'build/styles.css' : 'app/css/source.less'}
      }
    },

    copy: {
      assets: {
        expand: true,
        cwd: 'app/assets/',
        src: ['**'],
        dest: 'build/assets/',
      }
    },

    clean: ['build/templates.html', 'build/jsx'],

    uglify: {
      options: {
        mangle: true,
        compress: true,
      },
      build: {
        src: 'build/scripts.js',
        dest: 'build/scripts.js'
      }
    },

    nodemon: {
      server: { script: 'server.js' }
    },

    concurrent: {
      tasks: ['nodemon:server', 'watch'],
      options: {logConcurrentOutput: true}
    },

    watch: {
      html: {
        files: ['app/templates/*.html', 'app/index.html'],
        tasks: ['concat:html', 'replace', 'clean']
      },
      js: {
        files: ['app/js/**/*.js', 'app/jsx/**/*.jsx'],
        tasks: ['react', 'concat:js', 'clean']
      },
      css: {
        files: ['app/css/*.less'],
        tasks: ['less']
      },
      assets: {
        files: ['assets/**/*'],
        tasks: ['copy:assets']
      }
    },
  });

  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-react');

  grunt.registerTask('default', ['react', 'concat', 'replace', 'less', 'copy:assets', 'clean']);
  grunt.registerTask('dist', ['default', 'uglify']);
  grunt.registerTask('dev', ['default', 'concurrent']);
  grunt.registerTask('spritesheet', ['dist', 'concurrent']);
};
