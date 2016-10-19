//Vehicles collection
"use strict";

var Backbone = require("backbone");
var Defaults = require("../../defaults");
var vehiclesModel = require("../../models/vehicles/vehicles");

var vehicles = Backbone.Collection.extend( {
    model: vehiclesModel,
    url: Defaults.config.api
} );

module.exports = new vehicles();