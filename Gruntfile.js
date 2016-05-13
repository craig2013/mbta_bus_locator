module.exports = function(grunt) {
	// this is where all the grunt configs will go
	grunt.initConfig({	
		//read the package.json file
		pkg: grunt.file.readJSON('package.json'),

		jsbeautifier: {
			files: ['js/**/*.js'],
			options: {
				js: {
					"indent_size": 4,
					"indent_char": " ",
					"indent_level": 0,
					"indent_with_tabs": false,
					"preserve_newlines": true,
					"max_preserve_newlines": 10,
					"jslint_happy": true,
					"space_after_anon_function": true,
					"brace_style": "collapse",
					"keep_array_indentation": false,
					"keep_function_indentation": false,
					"space_before_conditional": true,
					"spaceInParen": true,
					"break_chained_methods": false,
					"eval_code": false,
					"unescape_strings": false,
					"wrap_line_length": 0
				}				
			}
		},

		uglify: {
			my_target: {
				files: {
					'maps.min.js': ['underscore-1.7.0.js','maps.js']
				}
			}
		},

		sass: {
			dist: {
				options: {
					quiet: false
				},
				files: {
					'css/styles.css' : 'css/sass/styles.scss'
				}
			}
		},	

		watch: {
			css: {
				files: 'css/sass/**/*.scss',
				tasks: ['sass']
			}
		}			
	});

	grunt.loadNpmTasks('grunt-jsbeautifier');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');	

	grunt.registerTask('js-beautifier', ['jsbeautifier']);	
	grunt.registerTask('js-uglify', ['uglify']);
	grunt.registerTask('watch-css',['watch']);
};