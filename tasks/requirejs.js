"use strict";

var gulp = require("gulp");
var gutil  = require("gulp-util");
var rename = require("gulp-rename");
var requirejsOptimize = require("gulp-requirejs-optimize");

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
		.pipe( gulp.dest("./dist/js/") );
});