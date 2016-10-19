//Vehicles model
"use strict";
var Backbone = require("backbone");
var Defaults = require("../../defaults");

var vehicles = Backbone.Model.extend({
    urlRout: Defaults.config.api
});

module.exports = vehicles;