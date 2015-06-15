/* global grunt, module, require, console */

'use strict';

var watchedFiles = [
  "**/*.js",
  "!**/node_modules/**",
  "!dist/*.js",
  "!tests/**",
  "!docs/**"
];

// Helper function to build the list of files that
// are to be concatenated and minified.
function buildFileList() {

  var fs = require('fs');
  var path = require('path');
  var root = "src";
  var filename = path.join(root, "all.json");
  var fileList = [];

  var data = fs.readFileSync(filename, 'utf8');
  JSON.parse(data).forEach(function(file) {
    fileList.push(path.join(root,file));
  });

  console.log( "fileList to concatenate / uglyfy is " + fileList.length + " lines long" );
  return fileList;

}

module.exports = function (grunt) {
  // load plugins
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jsdoc');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks("grunt-jscs");
  grunt.loadNpmTasks('grunt-karma');


  grunt.initConfig({

    concat: {
      dist: {
        options: {
          separator: '\n',
          nonull: true
        },
        // the files to concatenate
        src: buildFileList(),
        // the location of the resulting JS file
        dest: 'dist/framework_concat.js'
      }
    },

    uglify: {
      files: {
        src: 'dist/framework_concat.js',
        dest: 'dist/',   // destination folder
        expand: true,    // allow dynamic building
        flatten: true,   // remove all unnecessary nesting
        ext: '.min.js'   // replace .js to .min.js
      }
    },

    watch: {
      js:  {
        files: watchedFiles,
        tasks: [ 'concat', 'uglify']
      },
    },

    jsdoc : {
      dist : {
        src: buildFileList(),
        jsdoc: "node_modules/.bin/jsdoc",
        options: {
          destination: 'docs/build/',
          template : "docs/moebio-jsdoc",
          configure : "docs/jsdoc.conf.json",
          readme : "docs/jsdoc-readme.md"
        }
      }
    },

    jshint: {
      options: {
        jshintrc: true,
        ignores: ['libraries, dist'],
        reporter: require('jshint-stylish')
      },
      src: buildFileList()
    },

    jscs: {
      options: {
        config: ".jscsrc",
        reporter: require('jscs-stylish').path
      },
      src: buildFileList()
    },

    karma: {
      unit: {
        configFile: 'tests/karma.conf.js',
        singleRun: false,
        logLevel: 'WARN'
      }
    }
  });

  //
  // Default task - build distribution source
  //
  grunt.registerTask('default', ['concat', 'uglify']);

  //
  // Build documentation
  //
  grunt.registerTask('doc', [ 'jsdoc' ]);

  //
  // Run tests interactively
  //
  grunt.registerTask('test', [ 'karma' ]);

};
