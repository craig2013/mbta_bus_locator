//Load models and collections.
define( [
    "models/routes/routes",
    "models/direction/direction",
    "models/stops/stopsByDirection",
    "models/stops/stopsByRoute",
    "models/predictions/predictions",
    "models/vehicles/vehicles",
    "collections/routes/routes",
    "collections/direction/direction",
    "collections/stops/stopsByDirection",
    "collections/stops/stopsByRoute",
    "collections/predictions/predictions",
    "collections/vehicles/vehicles"
], function ( routesModel, directionModel, stopsByDirectionModel, stopsByRouteModel, predictionsModel, vehiclesModel,
    routesCollection, directionCollection, stopsByDirectionCollection, stopsByRouteCollection, predictionsCollection, vehiclesCollection ) {

    "use strict";

    return {
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
} );
