module.exports = function(grunt) {
    'use strict';
    require('load-grunt-tasks')(grunt, {
        pattern: ['grunt-*']
    });

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: {
            'cssSrcDir': 'src/sass',
            'cssTargetDir': 'css',
            'jsSrcDir': 'src/js',
            'jsTargetDir': 'js',
            'jsDependencies': [
              'node_modules/jquery/dist/jquery.js',
              'node_modules/bootstrap/dist/js/bootstrap.js',
              'node_modules/lazysizes/lazysizes.js'
            ],
            'cssDependencies': [
              'node_modules/bootstrap/dist/css/bootstrap.css',
              'node_modules/font-awesome/css/font-awesome.css'
            ]
        },
        copy: {
            dev: {
                files: [{
                    dest: 'static/fonts/',
                    src: '*',
                    cwd: 'src/fonts/',
                    expand: true
                }]
            },
            dist: {
                files: [{
                    dest: 'static/fonts/',
                    src: '*',
                    cwd: 'src/fonts/',
                    expand: true
                }]
            }
        },
        clean: {
            dist: ['static']
        },
        sass: {
            dev: {
                options: {
                    sourceMaps: true
                },
                files: {
                    'static/<%=  config.cssTargetDir %>/style.css': '<%=  config.cssSrcDir %>/style.scss'
                }
            },
            dist: {
                options: {
                    outputStyle: 'compressed',
                    sourceMaps: false
                },
                files: {
                    'static/<%=  config.cssTargetDir %>/style.css': '<%=  config.cssSrcDir %>/style.scss'
                }
            }
        },
        cssmin: {
            dev: {
                options: {
                    shorthandCompacting: false,
                    roundingPrecision: -1,
                    sourceMap: true
                },
                files: {
                    'static/<%=  config.cssTargetDir %>/dependencies.css': [
                        '<%=	config.cssDependencies %>'
                    ]
                }
            },
            dist: {
                options: {
                    shorthandCompacting: false,
                    roundingPrecision: -1,
                    sourceMap: false
                },
                files: {
                    'static/<%= config.cssTargetDir %>/dependencies.css': [
                        '<%= config.cssDependencies %>'
                    ],
                    'static/<%= config.cssTargetDir %>/main.css': [
                        '<%= config.cssDependencies %>',
                        'static/<%=  config.cssTargetDir %>/style.css'
                    ]
                }
            }
        },
        postcss: {
            options: {
                map: false,
                processors: [
                    require('autoprefixer')({
                        browsers: ['last 2 versions']
                    })
                ]
            },
            files: {
                src: 'static/<%=  config.cssTargetDir %>/*.css'
            }
        },
        uglify: {
            dev: {
                files: {
                    'static/<%= config.jsTargetDir %>/script.js': [
                        '<%= config.jsSrcDir %>/**/*.js'
                    ],
                    'static/<%= config.jsTargetDir %>/dependencies.js': [
                        '<%= config.jsDependencies %>'
                    ]
                }
            },
            devlight: {
                files: {
                    'static/<%= config.jsTargetDir %>/script.js': [
                        '<%= config.jsSrcDir %>/**/*.js'
                    ]
                }
            },
            dist: {
                files: {
                    'static/<%= config.jsTargetDir %>/script.js': [
                        '<%= config.jsSrcDir %>/**/*.js'
                    ],
                    'static/<%= config.jsTargetDir %>/dependencies.js': [
                        '<%= config.jsDependencies %>'
                    ],
                    'static/<%= config.jsTargetDir %>/main.js': [
                        '<%= config.jsDependencies %>',
                        '<%= config.jsSrcDir %>/**/*.js'
                    ]
                }
            }
        },
        watch: {
            css: {
                files: '<%=  config.cssSrcDir %>/**/*.scss',
                tasks: ['sass:dev', 'copy:dev', 'postcss']
            },
            js: {
                files: '<%=  config.jsSrcDir %>/**/*.js',
                tasks: ['uglify:devlight']
            }
        }
    });

    grunt.registerTask('build', [
        'clean:dist',
        'sass:dist',
        'cssmin:dist',
        'postcss',
        'copy:dist',
        'uglify:dist'
    ]);
    grunt.registerTask('default', [
        'sass:dev',
        'cssmin:dev',
        'postcss',
        'copy:dev',
        'uglify:dev',
        'watch'
    ]);
};
