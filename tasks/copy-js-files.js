"use strict";

var gulp = require("gulp");
var gutil  = require("gulp-util");

gulp.task("copy-js-files", function() {
	gulp.src("./src/js/libs/modernizr/modernizr.js", {base: "./src"})		
		.pipe(gulp.dest("./dist/"));

	gulp.src("./src/js/libs/require-js/require.js", {base: "./src"})
		.pipe(gulp.dest("./dist/"));
			
});