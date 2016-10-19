"use stict";

var gulp = require("gulp");

gulp.task("copy-files", ["update-html"], function() {
    return gulp.src([
        "./src/about.html",
        "./src/contact.html",
        "./src/faq.html",
        "./src/js/libs/modernizr/modernizr.js",
        "./src/img/*.png"
    ], {base: "./src"})
    .pipe(gulp.dest("./dist/"));    
});