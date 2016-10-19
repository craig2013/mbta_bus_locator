//Direction collection
"use strict";

var Backbone = require("backbone");
var Defaults = require("../../defaults");
var directionModel = require("../../models/direction/direction");

var direction = Backbone.Collection.extend( {
    model: directionModel,
    url: Defaults.config.api
} );

module.exports = new direction();
