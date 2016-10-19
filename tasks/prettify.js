"use strict";

var gulp = require("gulp");
var prettify = require("gulp-jsbeautifier");

gulp.task("pretify", function() {
    gulp.src(["./css/*.css", "./js/*.js"])
        .pipe(prettify({
            js: {
                files: ['./js/**/*.js']
            }
        }))
        .pipe(gulp.dest("./src/"));
});