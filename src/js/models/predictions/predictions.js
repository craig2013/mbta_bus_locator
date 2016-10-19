//Predictions model
"use strict";
var Backbone = require("backbone");
var Defaults = require("../../defaults");

var predictions = Backbone.Model.extend( {
    urlRoot: Defaults.config.api
} );

module.exports = predictions;