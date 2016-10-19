"use strict";

var gulp = require("gulp");
var gutil  = require("gulp-util");
var browserify = require('browserify');
var hbsfy = require("hbsfy");
var helpers = require("handlebars-helpers");
var plumber = require("gulp-plumber");
var source = require("vinyl-source-stream");

gulp.task("browserify", ["lint-js"], function() {
    // Browserify options
    var options = {
        debug: true,
        outfile: "bundle.js",
        paths: [
            "./node_modules/",
            "./src/js/libs/",
            "./src/js/defaults.js",
            "./src/js/router.js",
            "./src/js/app.js",
            "./src/js/models/**/*.js",
            "./src/js/collections/**/*.js",
            "./src/js/utility/**/*.js",
            "./src/js/views/**/*.js",
            "./src/js/templates/**/*.hbs"
        ]
    };

    hbsfy.configure({
        extensions: ["hbs"]
    });

    browserify("./src/js/app.js", options)
            .transform(hbsfy)
            .bundle()
            .pipe(plumber(function(e) {
                gutil.log(gutil.colors.red("Error (" + error.plugin + "): " + error.message));
                this.emit("end");
            }))
            .pipe(source("bundle.js"))
            .pipe(gulp.dest("./src/js/", {overwrite: true}));
})