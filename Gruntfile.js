'use strict';
module.exports = function(grunt) {
    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);

    // Show elapsed time at the end
    require('time-grunt')(grunt);

    grunt.loadNpmTasks('grunt-umd');
    grunt.loadNpmTasks('grunt-banner');

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed GPLv3 */\n',

        // Task configuration.
        clean: {
            files: ['dist']
        },

        umd: {
            all: {
                options: {
                    src: 'src/js/<%= pkg.name %>.js',
                    dest: 'dist/js/<%= pkg.name %>.js',
                    deps: {
                        args : ['$'],
                        'default': ['$'],
                        amd: {
                            indent: 6,
                            items: ['jquery'],
                            prefix: '\'',
                            separator: ',\n',
                            suffix: '\''
                        },
                        cjs: {
                            indent: 6,
                            items: ['jquery'],
                            prefix: 'require(\'',
                            separator: ',\n',
                            suffix: '\')'
                        },
                        global: {
                            items: ['jQuery'],
                        },
                        pipeline: {
                            indent: 0,
                            items : ['jquery'],
                            prefix: '//= require ',
                            separator: '\n',
                        }
                    }
                }
            }
        },

        usebanner: {
            taskName: {
                options: {
                    position: 'top',
                    banner: '<%= banner %>',
                    linebreak: true
                },
                files: {
                    src: ['dist/js/<%= pkg.name %>.js']
                }
            }
        },

        cssmin: {
            target: {
                files: [{
                    'dist/css/<%= pkg.name %>.min.css': ['dist/css/<%= pkg.name %>.css']
                }]
            }
        },

        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'src/fonts/',
                    src: ['**'],
                    dest: 'dist/fonts/'
                }]
            }
        },

        /* jshint ignore:end */
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                files: [{
                    src: 'dist/js/<%= pkg.name %>.js',
                    dest: 'dist/js/<%= pkg.name %>.min.js'
                }]
            }
        },
        jshint: {
            options: {
                reporter: require('jshint-stylish'),
                reporterOutput: ''
            },
            gruntfile: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: 'Gruntfile.js'
            },
            src: {
                options: {
                    jshintrc: 'src/.jshintrc'
                },
                src: ['src/**/*.js']
            }
        },
        sass: {
            options: { // Target options
                style: 'expanded'
            },
            dist: {
                files: {
                    'dist/css/lg-share.css': 'src/sass/lg-share.scss'
                }
            }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            src: {
                files: '<%= jshint.src.src %>',
                tasks: ['jshint:src', 'qunit']
            },
            css: {
                files: 'src/**/*.scss',
                tasks: ['sass']
            }
        },
        connect: {
            server: {
                options: {
                    hostname: '0.0.0.0',
                    port: 9000
                }
            }
        }
    });

    // Default task.
    grunt.registerTask('default', ['clean', 'jshint', 'connect', 'umd:all', 'uglify'/*, 'watch'*/, 'sass', 'cssmin', 'copy', 'usebanner']);
    grunt.registerTask('server', function() {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve']);
    });

    grunt.registerTask('serve', ['connect', 'watch']);
};
