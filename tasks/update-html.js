"use strict";

var gulp = require("gulp");
var gutil  = require("gulp-util");
var htmlreplace = require('gulp-html-replace');

gulp.task("update-html", function() {
	gulp.src("./src/index.html", {base: "./src"})
		.pipe(htmlreplace({
			"css": "/dist/css/styles.min.css",
			"js-modernizr": "/dist/js/libs/modernizr/modernizr.js",
			"js-app-index": {
				src: [["/dist/js/main.min.js", "/dist/js/libs/require/require.js"]],
				tpl: '<script data-main="%s" src="%s"></script>'
			}
		}))
		.pipe(gulp.dest("./dist/"));
});