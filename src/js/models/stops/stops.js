//Stops model
"use strict";
var Backbone = require("backbone");
var Defaults = require("../../defaults");

var stops = Backbone.Model.extend( {
    urlRoot: Defaults.config.api
} );

module.exports = stops;