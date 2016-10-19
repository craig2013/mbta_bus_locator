//Stops collection
"use strict";

var Backbone = require("backbone");
var Defaults = require("../../defaults");
var stopsModel = require("../../models/stops/stopsModel");

var stops = Backbone.Collection.extend( {
    model: stopsModel,
    url: Defaults.config.api
} );

module.exports = new stops();