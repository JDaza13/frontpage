'use strict';
/**
 * @ngdoc gruntfile
 * @author <a href="jose.daza@beitech.co">Jose Luis Daza</a> 
 * @description
 * Configuration file that automatically generates common development tasks
 */
 
var vendorScripts = require('./grunt_config/vendor_scripts.json');
var commonScripts = require('./grunt_config/common_scripts.json');
var angularScripts = require('./grunt_config/angular_scripts.json');

module.exports = function(grunt) {

    // Define the configuration for all the tasks
    grunt.initConfig({
        //configurable paths
        yeoman: {
            app: './app',
            dist: './app/dist',
            vendor: './vendor'
        },
        concat: {
            options: {
              separator: '/* Separator */',
            },
            dist: {
              src: vendorScripts.scripts,
              dest: '<%= yeoman.dist %>/scripts/vendor.js',
            },
        },
        uglify: {
            options: {
                compress: {},
                mangle: true,
                sourceMap: true
            },
            target: {
                src: '<%= yeoman.dist %>/scripts/vendor.js',
                dest: '<%= yeoman.dist %>/scripts/vendor.min.js'
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    //Group tasks for execution in production
    grunt.registerTask('build_production', [
        'concat',
        'uglify'
    ]);

  // Default task(s).
  grunt.registerTask('default', ['build_production']);

};