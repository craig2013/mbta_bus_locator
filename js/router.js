//Router
define( [
    "jquery",
    "underscore",
    "backbone",
    "marionette",
    "utility/router/router",
    "models/routes/routes",
    "models/stops/stops",
    "models/predictions/predictions",
    "models/vehicles/vehicles",
    "collections/routes/routes",
    "collections/stops/stops",
    "collections/predictions/predictions",
    "collections/vehicles/vehicles",
    "views/mode/mode",
    "views/routes/route",
    "views/direction/direction",
    "views/stops/stops",
    "views/predictions/predictions",
    "views/map/map"
], function ( $, _, Backbone, marionette, routerUtility, 
    routesModel, stopsModel, predictionsModel, vehiclesModel,
    routesCollection, stopsCollection, predictionsCollection, vehiclesCollection,
    modesView, routesView, directionsView, stopsView, predictionsView, mapsView ) {

    "use strict";

    var initialize = function () {
        var mbtaRouter = new router();

        Backbone.app.router = mbtaRouter;
        //homeRoute: No transpotation mode selected.
        mbtaRouter.on( "route:homeRoute", function () {
            routerUtility.closeOpenViews.apply(this, ["mapView", "predictionView","stopView","directionView","routeView"]);

            if ( this.modeView ) {
                this.modeView.close();
            }

            this.modeView = new modesView( {
                model: routesCollection
            } );
            this.modeView.render();
        } );

        //modeTypeSelected: Transportation mode selected.
        mbtaRouter.on( "route:modeTypeSelected", function( mode ) {
            routerUtility.closeOpenViews.apply(this, ["mapView", "predictionView","stopView", "directionView", "routeView"]);

            routerUtility.openViews.apply(this, [{view: "mode", property:mode}]);

            this.routeView = new routesView({
                model: routesCollection
            });

            this.routeView.render();
        });

        mbtaRouter.on( "route:routeSelected", function( mode, route ) {
            routerUtility.closeOpenViews.apply(this, ["mapView", "predictionView","stopView", "directionView"]);

            routerUtility.openViews.apply(this, [{mode:mode}, {route:route}]);

            this.directionView = new directionsView({
                model: stopsCollection
            });

            this.directionView.render();
        });

        mbtaRouter.on( "route:directionSelected", function( mode, route, direction ) {
            routerUtility.closeOpenViews.apply(this, ["mapView", "predictionView","stopView"]);

            routerUtility.openViews.apply(this, [{mode:mode}, {route:route}, {direction: direction}]);

            this.stopView = new stopsView({
                model: stopsCollection
            });

            this.stopView.render();
        });       

        mbtaRouter.on( "route:stopSelected", function( mode, route, direction, stop ) {
            routerUtility.closeOpenViews.apply(this, ["mapView"]);

            routerUtility.openViews.apply(this, [{mode:mode}, {route:route}, {direction: direction}, {stop: stop}]);

            this.predictionView = new predictionsView({
                model: predictionsCollection
            });

            this.predictionView.render();
        });        

        mbtaRouter.on( "route:showMap", function( mode, route, direction, stop ) {
            var viewsToOpen = [
                {
                    property: mode,
                    viewObject:map
                }
            ];
            routerUtility.openViews.apply(this, [{mode:mode}, {route:route}, {direction: direction}, {stop: stop}, {predictions: ""}]);

            this.mapView = new mapsView({
                model: predictionsCollection
            });

            this.mapView.render();
        });         

        Backbone.history.start();
    };

    var router = Backbone.Router.extend( {
        routes: {
            "": "homeRoute",
            "mode/:mode(/)": "modeTypeSelected",
            "mode/:mode/route/:route(/)": "routeSelected",
            "mode/:mode/route/:route/direction/:direction(/)": "directionSelected",
            "mode/:mode/route/:route/direction/:direction/stop/:stop(/)": "stopSelected",
            "mode/:mode/route/:route/direction/:direction/stop/:stop/map(/)": "showMap"
        }
    } );

    return {
        initialize: initialize
    };
} );
