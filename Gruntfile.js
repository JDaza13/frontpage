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
              separator: '\n\n/* Separator */\n\n',
            },
            dist: {
                files: [
                    {
                        src: vendorScripts.scripts,
                        dest: '<%= yeoman.dist %>/scripts/vendor.js'
                    },
                    {
                        src: commonScripts.scripts,
                        dest: '<%= yeoman.dist %>/scripts/common.js'
                    },
                    {
                        src: angularScripts.scripts,
                        dest: '<%= yeoman.dist %>/scripts/angularScripts.js'
                    }
                ]
            },
        },
        uglify: {
            options: {
                compress: {},
                mangle: false,
                sourceMap: false
            },
            target: {
                files: [
                    {
                        src: vendorScripts.scripts,
                        dest: '<%= yeoman.dist %>/scripts/vendor.min.js'
                    },
                    {
                        src: commonScripts.scripts,
                        dest: '<%= yeoman.dist %>/scripts/common.min.js'
                    },
                    {
                        src: angularScripts.scripts,
                        dest: '<%= yeoman.dist %>/scripts/angularScripts.min.js'
                    }
                ]
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    //Group tasks for execution in production
    grunt.registerTask('build_production', [
        'uglify'
    ]);
    
    //Group tasks for execution in development
    grunt.registerTask('build_development', [
        'concat'
    ]);

  // Default task(s).
  grunt.registerTask('default', ['build_production']);

};