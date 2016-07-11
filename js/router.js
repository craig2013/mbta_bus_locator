//Router
define( [
    "jquery",
    "underscore",
    "backbone",
    "Q",
    "utility/general/utility",
    "utility/router/router",
    "utility/models/models",
    "views/mode/mode",
    "views/routes/route",
    "views/direction/direction",
    "views/stops/stops",
    "views/predictions/predictions",
    "views/map/map"
], function ( $, _, Backbone, Q, generalUtility, routerUtility, modelsUtility,
    modesView, routesView, directionsView, stopsView, predictionsView, mapsView ) {

    "use strict";

    var initialize = function () {
        var mbtaRouter = new router();

        Backbone.app.router = mbtaRouter;

        Backbone.history.start();
    };

    var router = Backbone.Router.extend( {
        routes: {
            "(!/)": "showRoute", // Home route
            "!/:mode(/)": "showRoute", // Mode selected
            "!/:mode/:route(/)": "showRoute", // Route selected
            "!/:mode/:route/:direction(/)": "showRoute", // Direction selected
            "!/:mode/:route/:direction/:stop(/)": "showRoute", // Stop selected
            "!/:mode/:route/:direction/:stop/:map(/)": "showRoute" // Show map for route selected
        },
        /**
         * Method will show the views needed for a route.
         *
         * @param  {String} mode     The mode of transportation.  (bus, commuter rail, subway)
         * @param  {String} route     The route for the mode of transportation.
         * @param  {String} direction The direction being traveled on the route.
         * @param  {String} stop      The id/name of the stop predictions are being requested for. Commuter rail uses the stop name.
         * @return {Object} The views needed for a route.
         */
        showRoute: function ( mode, route, direction, stop, map ) {
            var self = this;

            // TODO: Add validation to mode, route, direction, stop before setting.
            // routerUtility.validateStop(route, direction, stop);

            // Set global parameters in Backbone.app.defaults object.
            if ( typeof mode === "string" ) {
                Backbone.app.defaults.mode = mode;
            }

            if ( typeof route === "string" ) {
                Backbone.app.defaults.route = route;
            }

            if ( typeof direction === "string" ) {
                Backbone.app.defaults.direction = direction;
            }

            if ( typeof stop === "string" ) {
                Backbone.app.defaults.stop = stop;
            }

            if ( typeof map === "string" ) {
                if ( map === "show-map" ) {
                    Backbone.app.defaults.map = map;
                    Backbone.app.defaults.showMap = true;
                }
            } else {
                Backbone.app.defaults.map = null;
                Backbone.app.defaults.showMap = false;
            }

            // Close any open views.  Home view never gets closed.
            routerUtility.closeViews.call( this, [ {
                property: route,
                view: "routeView"
            }, {
                property: direction,
                view: "directionView"
            }, {
                property: stop,
                view: "stopView"
            }, {
                property: stop,
                view: "predictionView"
            }, {
                property: map,
                view: "mapView"
            } ] );

            // Load home view.
            this.modeView = new modesView();
            this.modeView.render();

            // Load routes view.
            routerUtility.getRoutes.call( this, mode, routesView )
                .then( function ( r ) {
                    // Load direction view.
                    return routerUtility.getDirection.call( self, mode, route, directionsView );
                } )
                .then( function ( d ) {
                    // Load stop view.
                    return routerUtility.getStops.call( self, mode, route, direction, stopsView );
                } )
                .then( function ( s ) {
                    // Load predictions view.
                    return routerUtility.getPredictions.call( self, mode, route, direction, stop, map, predictionsView );
                } )
                .then( function ( p ) {
                    // Load map view.
                    return routerUtility.getMap.call( self, mode, route, direction, stop, map, mapsView );
                } )
                .catch( function ( e ) {
                    if ( e ) {
                        console.log( "Errors: " );
                        console.log( e );

                        alert( "There was an error, please try again." );
                    }
                } );
        }

    } );

    return {
        initialize: initialize
    };
} );
