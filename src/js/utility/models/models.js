//Load models and collections.
"use strict";
var routesModel = require("../../models/routes/routes");
var directionModel = require("../../models/routes/routes");
var stopsByDirectionModel = require("../../models/stops/stopsByDirection");
var stopsByRouteModel = require("../../models/stops/stopsByRoute");
var predictionsModel = require("../../models/predictions/predictions");
var vehiclesModel = require("../../models/vehicles/vehicles");
var routesCollection = require("../../collections/routes/routes");
var directionCollection = require("../../collections/direction/direction");
var stopsByDirectionCollection = require("../../collections/stops/stopsByDirection");
var stopsByRouteCollection = require("../../collections/stops/stopsByRoute");
var predictionsCollection = require("../../collections/predictions/predictions");
var vehiclesCollection = require("../../collections/vehicles/vehicles");

var modelsUtility = {
    routesModel: routesModel,
    directionModel: directionModel,
    stopsByDirectionModel: stopsByDirectionModel,
    stopsByRouteModel: stopsByRouteModel,
    predictionsModel: predictionsModel,
    vehiclesModel: vehiclesModel,
    routesCollection: routesCollection,
    directionCollection: directionCollection,
    stopsByDirectionCollection: stopsByDirectionCollection,
    stopsByRouteCollection: stopsByRouteCollection,
    predictionsCollection: predictionsCollection,
    vehiclesCollection: vehiclesCollection    
};

module.exports = modelsUtility;