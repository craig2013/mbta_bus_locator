"use strict";

var gulp = require("gulp");
var gutil  = require("gulp-util");

gulp.task("copy-html-files", ["update-html"], function() {
	return gulp.src([
		"./src/about.html",
		"./src/contact.html",
		"./src/faq.html"
	], {base: "./src"})
	.pipe(gulp.dest("./dist/"));	
});