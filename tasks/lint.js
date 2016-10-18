"use strict";

var gulp = require("gulp");
var gutil  = require("gulp-util");
var eslint = require("gulp-eslint");

gulp.task("lint-js", function() {
	return gulp.src( ["./src/js/**/*.js", "!node_modules/**"] )
		.pipe( eslint() )
		.pipe( eslint.format() )
		.pipe( eslint.failAfterError() );	
});