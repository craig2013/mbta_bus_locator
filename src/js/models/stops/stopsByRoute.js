/**
 * Stops by route model.
 */
"use strict";

var Backbone = require("backbone");
var Defaults = require("../../defaults");

var stopsByRoute = Backbone.Model.extend( {
    urlRoot: Defaults.config.api
} );

module.exports = stopsByRoute;