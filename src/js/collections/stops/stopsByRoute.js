/**
* Stops by route collection.
*/
"use strict";

var Backbone = require("backbone");
var Defaults = require("../../defaults");
var stopsByRouteModel = require("../../models/stops/stopsByRoute");

var stopsBuyRoute = Backbone.Collection.extend( {
    model: stopsByRouteModel,
    url: Defaults.config.api
} );

module.exports = new stopsBuyRoute();
