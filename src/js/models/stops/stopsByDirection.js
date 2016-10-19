/**
 * Stops by direction model.
 */
"use strict";
var Backbone = require("backbone");
var Defaults = require("../../defaults");

var stopsByDirection = Backbone.Model.extend( {
    urlRoot: Defaults.config.api
} );

module.exports = stopsByDirection;