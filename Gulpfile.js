"use strict";

var argv = require('yargs').argv;
var browserSync = require('browser-sync').create();
var cleanCSS = require('gulp-clean-css');
var eslint = require("gulp-eslint");
var gulp = require("gulp");
var gutil  = require("gulp-util");
var htmlreplace = require('gulp-html-replace');
var requirejsOptimize = require("gulp-requirejs-optimize");
var rename = require("gulp-rename");
var sass = require("gulp-sass");
var sourceMaps = require("gulp-sourcemaps");

var PATHS = {};

PATHS.scss = "./src/css/scss/**/*.scss";
PATHS.css = ( argv.production === undefined ) ? "./src/css/" : "./dist/css/";
PATHS.js = ( argv.production === undefined ) ? "./src/js/" : "./dist/js/";


// Define the default task.
gulp.task("default", ["watch"]);

gulp.task("lint-only", ["lint-only"]);

// Define the build task.
gulp.task("build", ["build-requirejs", "copy-files", "minify-css", "update-html"]);

// Configure jshint task.
gulp.task("lint", function() {
	return gulp.src( ["./src/js/**/*.js", "!node_modules/**"] )
		.pipe( eslint() )
		.pipe( eslint.format() )
		.pipe( eslint.failAfterError() );
});

// Configure the sass compile task.
gulp.task("build-css", function() {
	return gulp.src( PATHS.scss )
		.pipe( sass() )
		.pipe( sourceMaps.init() )
		.pipe( sourceMaps.write("./") )
		.pipe( gulp.dest(PATHS.css) );
});

// Configure the watch task.
gulp.task("watch", function() {
	gulp.watch( PATHS.scss, ["build-css"]);
	gulp.watch( "./src/js/**/*.js", ["lint"] );
});

// Configure the require-js build task.
gulp.task("build-requirejs", function() {
	return gulp.src( "./src/js/main.js" )
		.pipe(requirejsOptimize({
			paths: {
			        async: "libs/require-js/plugins/async/async",
			        markerlabel: "libs/google-maps/markerwithlabel-amd",
			        jquery: "libs/jquery/jquery",
			        underscore: "libs/underscore/underscore",
			        backbone: "libs/backbone/backbone",
			        chosen: "libs/jquery/plugins/chosen/chosen",
			        Q: "libs/q/q",
			        text: "text",
			        templates: "templates/"				
			},
			shim: {
				jquery: {
				    exports: "$"
				},
				chosen: {
				    deps: [ "jquery" ]
				},
				Q: {
				    exports: "Q"
				},
				underscore: {
				    exports: "_"
				},
				backbone: {
				    deps: [ "jquery", "underscore" ],
				    exports: "Backbone"
				}
			}			    
		}))
		.pipe(rename("main.min.js"))
		.pipe( gulp.dest(PATHS.js) )
});

// Configure minify css task.
gulp.task("minify-css", function() {
	return gulp.src("./src/css/styles.css")
		.pipe(cleanCSS())
		.pipe(rename("styles.min.css"))
		.pipe(gulp.dest(PATHS.css));
});

// Configure the copy files task.
gulp.task("copy-files", function() {
	gulp.src("./src/js/libs/modernizr/modernizr.js")		
		.pipe(gulp.dest("./dist/js/libs/modernizr/"));

	gulp.src("./src/js/libs/require-js/require.js")
		.pipe(gulp.dest("./dist/js/libs/require/"));
});

// Configure the update html task.
gulp.task("update-html", function() {
	gulp.src("./index.html")
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

// Catch errors so gulp doesn't crash.
function swallowError(error) {
	// If you want details of the error in the console
	console.log(error.toString());

	this.emit('end');
}