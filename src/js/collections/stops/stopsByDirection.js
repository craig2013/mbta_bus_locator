/**
 * Stops by route collection.
 */
"use strict";

var Backbone = require("backbone");
var Defaults = require("../../defaults");
var stopsByDirectionModel = require("../../models/stops/stopsByDirection");

var stopsByDirection = Backbone.Collection.extend( {
    model: stopsByDirectionModel,
    url: Defaults.config.api
} );

module.exports = new stopsByDirection();