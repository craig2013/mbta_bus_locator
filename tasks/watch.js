"use strict";

var gulp = require("gulp");

gulp.task("watch", function() {
	gulp.watch( "./src/css/scss/**/*.scss", ["build-css"]);
	gulp.watch(["./src/js/**/*.js", "./src/js/templates/**/*.hbs", "!./src/js/bundle.js", "!./src/js/libs/**/*.js"], ["lint-js", "pretify", "browserify"]);
});