//Predictions collection
"use strict";

var Backbone = require("backbone");
var Defaults = require("../../defaults");
var predictionModel = require("../../models/predictions/predictions");

var predictions = Backbone.Collection.extend( {
    model: predictionModel,
    url: Defaults.config.api
} );

module.exports = new predictions();