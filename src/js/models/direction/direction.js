//Direction model
"use strict";
var Backbone = require("backbone");
var Defaults = require("../../defaults");

var direction = Backbone.Model.extend( {
    urlRoot: Defaults.config.api
} );

module.exports = direction;