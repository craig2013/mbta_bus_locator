"use strict";

var gulp = require("gulp");
var htmlreplace = require('gulp-html-replace');

gulp.task("update-html", function() {
	gulp.src("./src/*.html", {base: "./src"})
		.pipe(htmlreplace({
			"css": "css/styles.min.css",
			"js-modernizr": "js/libs/modernizr/modernizr.js",
			"js-app-index": {
				src: "js/main.min.js",
				tpl: "<script src=\"%s\"></script>"
			}
		}))
		.pipe(gulp.dest("./dist/"));
});