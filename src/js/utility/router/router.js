//Router utility functions.
"use strict";
var $ = require("jquery");
var _ = require("underscore");
var Backbone = require("backbone");
var Q = require("q");
var Defaults = require("../../defaults");
var generalUtility = require("../general/utility");
var modelsUtility = require("../../utility/models/models");

var routerUtility = {
    /**
     * Will close open views that are passed in as a parameter.
     *
     * @param  {Array} properties A list of all the views to close.
     */
    closeViews: function ( properties ) {
        for ( var i = 0; i < properties.length; i++ ) {
            if ( !( properties[ i ].property ) ) {
                if ( this[ properties[ i ].view ] ) {
                    this[ properties[ i ].view ].close();
                }
            }
        }
    },
    /**
     * Displays the route view based on the mode selected.
     *
     * @param  {String} mode       The transportation mode selected.
     * @param  {Object} routesView The routesView object.
     * @return {Object}            The route view with the routes for the selected transportation mode.
     */
    getRoutes: function ( mode, routesView ) {
        var self = this;

        return new Q.promise( function ( resolve, reject ) {
            if ( mode ) {
                modelsUtility.routesCollection.url = Defaults.config.api + "routes/" + mode;
                modelsUtility.routesCollection.fetch( {
                    traditional: true,
                    success: function ( model ) {
                        self.routeView = new routesView( {
                            model: model
                        } );

                        self.routeView.render();

                        resolve( "getRoutes success." );
                    },
                    error: function ( model, xhr ) {
                        console.log( "Error fetching routes." );
                        console.log( xhr.responseText );
                        reject( "There was an error loading routes." );
                    }
                } );
            }
        } );
    },
    /**
     * Gets the directions for a selected route.
     * @param  {String} route          The selected route.
     * @param  {Object} directionsView The directionsView object.
     * @return {Object}                The direction view with the directions for the selected route.
     */
    getDirection: function ( mode, route, directionsView ) {
        var self = this;
        return new Q.promise( function ( resolve, reject ) {
            
            if ( mode && route ) {
                modelsUtility.directionCollection.url = Defaults.config.api + "routes/" + mode + "/" + route + "/direction";

                modelsUtility.directionCollection.fetch( {
                    traditional: true,
                    success: function ( model ) {
                        self.directionView = new directionsView( {
                            model: model
                        } );

                        self.directionView.render();

                        resolve( "getDirection success." );
                    },
                    error: function ( model, xhr ) {
                        console.log( "Error fetching route directions." );
                        console.log( xhr.responseText );
                        reject( "There was an error loading the directions for the route." );
                    }
                } );
            }
        } );
    },
    /**
     * Gets the stops for a selected route and direction.
     * @param  {String} route     The selected route.
     * @param  {String} direction The selected direction.
     * @param  {Object} stopsView The stopsView object.
     * @return {Object}           The stopsView with the stops for the selected route and direction.
     */
    getStops: function ( mode, route, direction, stopsView ) {
        var self = this;
        return new Q.promise( function ( resolve, reject ) {
            if ( mode && route && direction ) {

                modelsUtility.stopsByDirectionCollection.url = Defaults.config.api + "routes/" + mode + "/" + route + "/" + direction;

                modelsUtility.stopsByDirectionCollection.fetch( {
                    traditional: true,
                    success: function ( model ) {
                        self.stopView = new stopsView( {
                            model: model
                        } );

                        self.stopView.render();

                        resolve( "getStops success." );
                    },
                    error: function ( model, xhr ) {
                        console.log( "Error fetching stops for the selected route." );
                        console.log( xhr.responseText );
                        reject( "There was an error loading the route stops." );
                    }
                } );
            }
        } );
    },
    getPredictions: function ( mode, route, direction, stop, map, predictionsView ) {
        var self = this;
        return new Q.promise( function ( resolve, reject ) {
            if ( mode && route && direction && stop ) {
                var stopName = $( "#stop-select" ).find( "option:selected" ).attr( "data-stop-name" );
                var url = "";

                if ( mode === "commuter+rail" ) {
                    url = Defaults.config.api + "routes/" + mode + "/" + route + "/" + direction + "/" + encodeURIComponent( stopName );
                } else {
                    url = Defaults.config.api + "routes/" + mode + "/" + route + "/" + direction + "/" + stop;
                }

                modelsUtility.predictionsCollection.url = url;

                modelsUtility.predictionsCollection.fetch( {
                    traditionnal: true,
                    success: function ( model ) {
                        self.predictionView = new predictionsView( {
                            model: model,
                            map: map,
                            stopName: stopName,
                            predictionURL: url
                        } );

                        self.predictionView.render();

                        resolve( "getPredictions success." );
                    },
                    error: function ( model, xhr ) {
                        console.log( "Error fetching stops for the selected route." );
                        console.log( xhr.responseText );
                        reject( "There was an error loading the route predictions." );
                    }
                } );
            }
        } );
    },
    getMap: function ( mode, route, direction, stop, map, mapsView ) {
        var self = this;
        return new Q.promise( function ( resolve, reject ) {
            if ( mode && route && direction && stop && map ) {
                var vehicleOptions = {};

                Defaults.showMap = true;

                modelsUtility.stopsByRouteCollection.url = Defaults.config.api + "/routes/" + mode + "/" + route + "/";

                modelsUtility.stopsByRouteCollection.fetch( {
                    traditional: true,
                    success: function ( ) {
                        var routeName = $( "#route-select option:selected" ).attr( "data-route-name" );
                        var stopName = $( "#stop-select option:selected" ).attr( "data-route-name" );
                        var url = "";
                        
                        if ( mode === "commuter+rail" ) {
                            url = Defaults.config.api + "routes/" + mode + "/" + routeName + "/" + direction + "/" + stopName + "/vehicles";
                        } else {
                            url = Defaults.config.api + "routes/" + mode + "/" + routeName + "/" + direction + "/" + stop + "/vehicles";
                        }

                        modelsUtility.vehiclesCollection.url = url;

                        modelsUtility.vehiclesCollection.fetch( {
                            traditional: true,
                            success: function ( m ) {
                                self.mapView = new mapsView( {
                                    model: m,
                                    vehicleOptions: vehicleOptions
                                } );

                                self.mapView.render();
                                resolve( "getMap success." );
                            },
                            error: function ( model, xhr ) {
                                console.log( "There was an error loading the vehicle locations for the map." );
                                console.log( xhr.responseText );
                                reject( "There was an error loading the vehicle locations for the map." );
                            }
                        } );
                    },
                    error: function ( model, xhr ) {
                        console.log( "There was an error loading the stops for the map." );
                        console.log( xhr.responseText );
                        reject( "There was an error loading the stops for the map." );
                    }
                } );
            }
        } );
    }
};

module.exports = routerUtility;