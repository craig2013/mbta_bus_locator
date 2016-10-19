//Routes model
"use strict";

var Backbone = require("backbone");
var Defaults = require("../../defaults");

var routes = Backbone.Model.extend( {
    urlRoot: Defaults.config.api + "routes/"
} );

module.exports = routes;