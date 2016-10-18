"use strict";

var gulp = require("gulp");
var gutil  = require("gulp-util");

gulp.task("watch", function() {
	gulp.watch( "./src/css/scss/**/*.scss", ["build-css"]);
	gulp.watch( "./src/js/**/*.js", ["lint-js"] );
});