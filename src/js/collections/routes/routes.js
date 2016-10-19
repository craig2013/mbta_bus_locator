//Routes collection
"use strict";

var Backbone = require("backbone");
var Defaults = require("../../defaults");
var routesModel = require("../../models/routes/routes");

var routes = Backbone.Collection.extend( {
    model: routesModel,
    url: Defaults.config.api + "routes/"
} );

module.exports =  new routes();