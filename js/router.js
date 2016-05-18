//Router
define( [
    "jquery",
    "underscore",
    "backbone",
    "utility/general/utility",
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
], function ( $, _, Backbone, generalUtility, routerUtility,
    routesModel, stopsModel, predictionsModel, vehiclesModel,
    routesCollection, stopsCollection, predictionsCollection, vehiclesCollection,
    modesView, routesView, directionsView, stopsView, predictionsView, mapsView ) {

    "use strict";

    var initialize = function () {
        var mbtaRouter = new router();

        Backbone.app.router = mbtaRouter;

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
        },
        homeRoute: function () {
            routerUtility.closeViews.apply( this, [ "mapView", "predictionView", "stopView", "directionView", "routeView", "modeView" ] );

            this.modeView = new modesView( {
                model: routesCollection
            } );
            this.modeView.render();
        },
        modeTypeSelected: function ( mode ) {
            routerUtility.closeViews.apply( this, [ "mapView", "predictionView", "stopView", "directionView", "routeView" ] );

            routerUtility.openViews.apply( this, [ {
                property: mode,
                propertyName: "mode",
                routeMethodName: "homeRoute",
                view: "modeView"
            } ] );

            this.routeView = new routesView( {
                model: routesCollection
            } );

            this.routeView.render();
        },
        routeSelected: function ( mode, route ) {
            routerUtility.closeViews.apply( this, [ "mapView", "predictionView", "stopView", "directionView" ] );

            routerUtility.openViews.apply( this, [ {
                property: mode,
                propertyName: "mode",
                routeMethodName: "homeRoute",
                view: "modeView"
            }, {
                property: route,
                propertyName: "route",
                routeMethodName: "modeTypeSelected",
                view: "routeView"
            } ] );

            this.directionView = new directionsView( {
                model: stopsCollection
            } );

            this.directionView.render();
        },
        directionSelected: function ( mode, route, direction ) {
            routerUtility.closeViews.apply( this, [ "mapView", "predictionView", "stopView" ] );

            routerUtility.openViews.apply( this, [ {
                property: mode,
                propertyName: "mode",
                routeMethodName: "homeRoute",
                view: "modeView"
            }, {
                property: route,
                propertyName: "route",
                routeMethodName: "modeTypeSelected",
                view: "routeView"
            }, {
                property: direction,
                propertyName: "direction",
                routeMethodName: "routeSelected",
                view: "directionView"
            } ] );

            this.stopView = new stopsView( {
                model: stopsCollection
            } );

            this.stopView.render();
        },
        stopSelected: function ( mode, route, direction, stop ) {
            routerUtility.closeViews.apply( this, [ "mapView" ] );

            routerUtility.openViews.apply( this, [ {
                property: mode,
                propertyName: "mode",
                routeMethodName: "homeRoute",
                view: "modeView"
            }, {
                property: route,
                propertyName: "route",
                routeMethodName: "modeTypeSelected",
                view: "routeView"
            }, {
                property: direction,
                propertyName: "direction",
                routeMethodName: "routeSelected",
                view: "directionView"
            }, {
                property: stop,
                propertyName: "stop",
                routeMethodName: "directionSelected",
                view: "stopView"
            }, {
                property: stop,
                propertyName: "stop",
                routeMethodName: "stopSelected",
                view: "predictionView"
            } ] );

            this.predictionView = new predictionsView( {
                model: predictionsCollection
            } );

            this.predictionView.render();
        },
        showMap: function ( mode, route, direction, stop ) {
            routerUtility.openViews.apply( this, [ {
                property: mode,
                propertyName: "mode",
                routeMethodName: "homeRoute",
                view: "modeView"
            }, {
                property: route,
                propertyName: "route",
                routeMethodName: "modeTypeSelected",
                view: "routeView"
            }, {
                property: direction,
                propertyName: "direction",
                routeMethodName: "routeSelected",
                view: "directionView"
            }, {
                property: stop,
                propertyName: "stop",
                routeMethodName: "directionSelected",
                view: "stopView"
            }, {
                property: stop,
                propertyName: "stop",
                routeMethodName: "stopSelected",
                view: "predictionView"
            } ] );

            this.mapView = new mapsView( {
                model: predictionsCollection
            } );

            this.mapView.render();
        }
    } );

    return {
        initialize: initialize
    };
} );
