"use strict";

var gulp = require("gulp");
var gutil  = require("gulp-util");
var requireDir = require('require-dir');

// Pulling in all tasks from the tasks folder
requireDir('./tasks', { recurse: true });

// Define the default task.
gulp.task("default", ["watch"]);

// Define the build task.
gulp.task("build", ["build-requirejs", "copy-js-files", "minify-css", "update-html", "copy-html-files"]);


// Catch errors so gulp doesn't crash.
function swallowError(error) {
	// If you want details of the error in the console
	console.log(error.toString());

	this.emit('end');
}