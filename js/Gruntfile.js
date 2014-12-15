module.exports = function(grunt) {
	// this is where all the grunt configs will go
	grunt.initConfig({	
		//read the package.json file
		pkg: grunt.file.readJSON('package.json'),

		jsbeautifier: {
			files: 'maps.js',
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
		}
	});

	grunt.loadNpmTasks('grunt-jsbeautifier');
	grunt.registerTask('js-beautifier', ['jsbeautifier']);	

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('js-uglify', ['uglify']);
};