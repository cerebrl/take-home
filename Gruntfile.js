/**
 * Grunt file for our task runner and build process
 */

module.exports = function(grunt) {

	"use strict";

	// Project configuration.
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),
		clean: {
			dev: '_public/dev',
			dist: '_public/dist'
		},
		copy: {
			src: [
				'*.xml',
				'*.txt',
				'favicons/**/*',
				'fonts/**/*',
				'vendor-bower/*/*.js',
				'vendor-bower/*/compressed/*.js',
				'vendor-bower/*/*.map',
				'vendor-manual/**/*.js',
				'vendor-manual/**/*.css',
				'phi/framework/**/*.js',
				'phi/framework/img/**/*',
				'img/**/*'
			],
			dev: {
				src: '<%= copy.src %>',
				dest: '_public/dev',
				expand: true,
				cwd: './front-end'
			},
			dist: {
				src: '<%= copy.src %>',
				dest: '_public/dist',
				expand: true,
				cwd: './front-end'
			}
		},
		concat: {
			options: {
				banner: '/*! <%= pkg.name %> | Version: <%= pkg.version %> | ' +
						'Concatenated on <%= grunt.template.today("yyyy-mm-dd") %> */\n\n',
				separator: '\n\n;// End of file\n\n'
			},
			main: {
				src: 'front-end/js/*.js',
				dest: '_public/dev/js/main.js'
			},
			send: {
				src: 'front-end/js/send/*.js',
				dest: '_public/dev/js/send.js'
			},
			trans: {
				src: 'front-end/js/transactions/*.js',
				dest: '_public/dev/js/trans.js'
			}
		},
		watch: {
			server: {
				files: '<%= jshint.server %>',
				tasks: ['jshint:server']
			},
			client: {
				files: '<%= jshint.client %>',
				tasks: ['jshint:client', 'concat', 'copy', 'macreload']
			},
			scss: {
				files: 'front-end/sass/*.scss',
				tasks: ['compass:dev', 'macreload']
			}
		},
		jshint: {
			server: [
				'*.js',
				'middle-end/**/*.js',
				'config/**/*.js'//,
				//'test/**/*.js'
			],
			client: [
				'front-end/js/**/*.js'
			],
			options: {
				jshintrc: '.jshintrc'   // See jshintrcExplained.js for more details
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> | Version: <%= pkg.version %> | ' +
						'Minified on <%= grunt.template.today("yyyy-mm-dd") %> */\n\n'
			},
			prod: {
				expand: true,           // Enable dynamic expansion.
				cwd: '_public/dev/js',   // Src matches are relative to this path.
				src: ['**/*.js'],       // Actual pattern(s) to match.
				dest: '_public/dist/js', // Destination path prefix.
				ext: '.js',             // Dest filepaths will have this extension.
				flatten: false          // Remove directory structure in destination
			},
			requirejs: {
				expand: true,           // Enable dynamic expansion.
				cwd: 'front-end/vendor-bower/requirejs',   // Src matches are relative to this path.
				src: ['require.js'],       // Actual pattern(s) to match.
				dest: 'front-end/vendor-bower/requirejs', // Destination path prefix.
				ext: '.min.js'             // Dest filepaths will have this extension.
			}
		},
		compass: {
			dist: {
				options: {
					sassDir: 'front-end/sass',
					cssDir: '_public/dist/css',
					environment: 'production'
				}
			},
			dev: {
				options: {
					sassDir: 'front-end/sass',
					cssDir: '_public/dev/css'
				}
			}
		},
		nodemon: {
            dev: {
                options: {
                    file: 'web.js',
                    args: [],
                    ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
                    watchedExtensions: ['js'],
                    watchedFolders: ['middle-end', 'config'],
                    debug: true,
                    delayTime: 1,
                    env: {
                        PORT: 5000
                    },
                    cwd: __dirname
                }
            },
			prod: {
				options: {
                    file: 'web.js',
                    args: [],
                    ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
                    watchedExtensions: ['js'],
                    watchedFolders: ['middle-end', 'config'],
                    debug: false,
                    delayTime: 1,
                    env: {
						NODE_ENV: 'production',
                        PORT: 5000
                    },
                    cwd: __dirname
                }
			}
        },
        concurrent: {
            tasks: ['nodemon:dev', 'watch:server', 'watch:client', 'watch:scss'],
            options: {
                logConcurrentOutput: true
            }
        },
		macreload: {
			reload: {
				browser: 'canary'
			}
		},
		jasmine: {
			src: 'test/*helper.js',
			options: {
				specs: 'test/spec/*.spec.js'
			}
		}
	});

	// Load in contrib tasks
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jasmine');

	// Load the "Live Reload" alternative
	grunt.loadNpmTasks('grunt-macreload');

	// Implement Nodemon into Grunt
    grunt.loadNpmTasks('grunt-nodemon');

	// Implement Concurrent
    grunt.loadNpmTasks('grunt-concurrent');

    // Making grunt default to force in order not to break the project.
    grunt.option('force', true);

	// Test JS Code
	grunt.registerTask('test', ['jshint', 'jasmine']);

	// Default tasks for grunt.
	grunt.registerTask('default', ['jshint', 'concurrent']);

	// Tasks for grunt dev (rarely used, but available).
	grunt.registerTask('dev', [
			'jshint',
			'uglify:requirejs',
			'clean:dev',
			'concat',
			'copy:dev',
			'compass:dev'
		]);

	// Production build task.
	grunt.registerTask('build', [
			'jshint',
			'clean:dev',
			'concat',
			'copy:dev',
			'compass:dev',
			'clean:dist',
			'copy:dist',
			'uglify:prod',
			'compass:dist',
			'nodemon:prod'
		]);

};
