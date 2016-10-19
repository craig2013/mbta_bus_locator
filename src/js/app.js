"use strict"; 

var $ = require("jquery");
var _ = require("underscore");
var Backbone = require("backbone");
var Defaults = require("./defaults");
var Router = require("./router");
var App = {};

var mbta_router = new Router();

Defaults["router"] = mbta_router;

Backbone.history.start();

/**
 * Function is pollyfil for isArray for testing if a object is an array.
 *
 * @return true if object is an array or false if it isn't.
 **/
if ( !Array.isArray ) {
    Array.isArray = function ( arg ) {
        return Object.prototype.toString.call( arg ) === "[object Array]";
    };
}


