//Load models and collections.
define( [
    "models/routes/routes",
    "models/direction/direction",
    "models/stops/stops",
    "models/predictions/predictions",
    "models/vehicles/vehicles",
    "collections/routes/routes",
    "collections/direction/direction",
    "collections/stops/stops",
    "collections/predictions/predictions",
    "collections/vehicles/vehicles"
], function ( routesModel, directionModel, stopsModel, predictionsModel, vehiclesModel,
    routesCollection, directionCollection, stopsCollection, predictionsCollection, vehiclesCollection ) {

    "use strict";

    return {
        routesModel: routesModel,
        directionModel: directionModel,
        stopsModel: stopsModel,
        predictionsModel: predictionsModel,
        vehiclesModel: vehiclesModel,
        routesCollection: routesCollection,
        directionCollection: directionCollection,
        stopsCollection: stopsCollection,
        predictionsCollection: predictionsCollection,
        vehiclesCollection: vehiclesCollection
    }
} );
