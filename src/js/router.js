//Router
"use strict";

var $ = require("jquery");
var _ = require("underscore");
var Backbone = require("backbone");
var Q  = require("q");
var Defaults = require("./defaults");
var routerUtility = require("./utility/router/router");
var modelsUtility = require("./utility/models/models");
var modesView = require("./views/mode/mode");
var routesView = require("./views/routes/route");
var directionsView = require("./views/direction/direction");
var stopsView = require("./views/stops/stops");
var predictionsView = require("./views/predictions/predictions");
var mapsView = require("./views/map/map");

Backbone.$ = $;


var Router = Backbone.Router.extend( {
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
            Defaults.mode = mode;
        }

        if ( typeof route === "string" ) {
            Defaults.route = route;
        }

        if ( typeof direction === "string" ) {
            Defaults.direction = direction;
        }

        if ( typeof stop === "string" ) {
            Defaults.stop = stop;
        }

        if ( typeof map === "string" ) {
            if ( map === "show-map" ) {
                Defaults.map = map;
                Defaults.showMap = true;
            }
        } else {
            Defaults.map = null;
            Defaults.showMap = false;
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
            .then( function () {
                // Load direction view.
                return routerUtility.getDirection.call( self, mode, route, directionsView );
            } )
            .then( function () {
                // Load stop view.
                return routerUtility.getStops.call( self, mode, route, direction, stopsView );
            } )
            .then( function () {
                // Load predictions view.
                return routerUtility.getPredictions.call( self, mode, route, direction, stop, map, predictionsView );
            } )
            .then( function () {
                // Load map view.
                return routerUtility.getMap.call( self, mode, route, direction, stop, map, mapsView );
            } )
            .catch( function () {
                if ( e ) {
                    console.log( "Errors: " );
                    console.log( e );

                    alert( "There was an error, please try again." );
                }
            } );
    }
});

module.exports = Router;
