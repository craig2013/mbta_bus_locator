//Router
define( [
    "jquery",
    "underscore",
    "backbone",
    "utility/general/utility",
    "utility/router/router",
    "utility/models/models",
    "views/mode/mode",
    "views/routes/route",
    "views/direction/direction",
    "views/stops/stops",
    "views/predictions/predictions",
    "views/map/map"
], function ( $, _, Backbone, generalUtility, routerUtility, modelsUtility,
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
                routerUtility.closeViews( this, [ {
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

                // If the mode is set then show the route dropdown,
                if ( mode ) {
                    modelsUtility.routesCollection.fetch( {
                        traditional: true,
                        data: {
                            "queryType": "routes"
                        },
                        success: function ( r ) {

                                // Load route view.
                                self.routeView = new routesView( {
                                    model: modelsUtility.routesCollection
                                } );

                                self.routeView.render();

                                if ( route ) {
                                    modelsUtility.directionCollection.fetch( {
                                        traditional: true,
                                        data: {
                                            "queryType": "stopsbyroute",
                                            "queryString": "route",
                                            "queryValue": route
                                        },
                                        success: function ( d ) {

                                                // Load direction view. 
                                                self.directionView = new directionsView( {
                                                    model: modelsUtility.directionCollection
                                                } );

                                                self.directionView.render();

                                                if ( route && direction ) {
                                                    modelsUtility.stopsCollection.fetch( {
                                                        traditional: true,
                                                        data: {
                                                            "queryType": "stopsbyroute",
                                                            "queryString": "route",
                                                            "queryValue": route
                                                        },
                                                        success: function ( s ) {

                                                                // Load stop view.
                                                                self.stopView = new stopsView( {
                                                                    model: modelsUtility.stopsCollection
                                                                } );

                                                                self.stopView.render();

                                                                if ( route && direction && stop ) {
                                                                    var predictionOptions = {};
                                                                    var queryValue = "";
                                                                    var stopName = $( "#stop-select" ).find( "option:selected" ).attr( "data-stop-name" );

                                                                    Backbone.app.defaults.stopName = stopName;

                                                                    if ( mode === "commuter+rail" ) {
                                                                        queryValue = stopName;
                                                                    } else {
                                                                        queryValue = stop;
                                                                    }

                                                                    predictionOptions = {
                                                                        data: {
                                                                            "queryType": "predictionsbystop",
                                                                            "queryString": "stop",
                                                                            "queryValue": queryValue
                                                                        }
                                                                    };

                                                                    modelsUtility.predictionsCollection.fetch( {
                                                                        traditional: true,
                                                                        data: predictionOptions.data,
                                                                        success: function ( p ) {

                                                                            //Load  predictions view.
                                                                            self.predictionView = new predictionsView( {
                                                                                model: modelsUtility.predictionsCollection,
                                                                                map: map,
                                                                                predictionOptions: predictionOptions
                                                                            } );

                                                                            self.predictionView.render();


                                                                            if ( route && direction && stop && map === "show-map" ) {
                                                                                var vehicleOptions = {};
                                                                                var mapRoute = $( "#route-select option:selected" ).attr( "data-route-name" );

                                                                                vehicleOptions = {
                                                                                    data: {
                                                                                        "queryType": "vehiclesbyroute",
                                                                                        "queryString": "route",
                                                                                        "queryValue": mapRoute
                                                                                    }
                                                                                }
                                                                                modelsUtility.vehiclesCollection.fetch( {
                                                                                    traditional: true,
                                                                                    data: vehicleOptions.data,
                                                                                    success: function ( v ) {

                                                                                        self.mapView = new mapsView( {
                                                                                            model: modelsUtility.vehiclesCollection,
                                                                                            predictionOptions: predictionOptions,
                                                                                            vehicleOptions: vehicleOptions
                                                                                        } );

                                                                                        self.mapView.render();
                                                                                    }
                                                                                } );
                                                                            }
                                                                        }
                                                                    } );
                                                                } // if stop
                                                            } // stopsCollections success
                                                    } ); // stopsCollection.fetch    

                                                } // if direction
                                            } // stopsCollection success
                                    } ); // stopsCollection.fetch

                                } // if route
                            } // routesCollection success
                    } ); // routesCollection.fetch
                } // if mode

            } // showRoute
    } );

    return {
        initialize: initialize
    };
} );
