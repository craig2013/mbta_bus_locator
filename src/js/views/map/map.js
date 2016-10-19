//Map view
"use strict";

var $ = require("jquery");
var _ = require("underscore");
var Backbone = require("backbone");
var Handlebars = require("hbsfy/runtime");
var GoogleMapsLoader = require("google-maps");
var Defaults = require("../../defaults");
var generalUtility = require("../../utility/general/utility");
var modelUtility = require("../../utility/models/models");
var mapUtility = require("../../utility/map/map");
var predictionsUtility = require("../../utility/predictions/predictions");
var mapsTemplate = require("../../templates/map/map.hbs");

var mapView = Backbone.View.extend( {
    el: ".map-container",

    initialize: function ( options ) {
        this.options = options;

        this.listenTo( modelUtility.vehiclesCollection, "sync", this.render );
    },

    render: function () {

        var stopsModel = modelUtility.stopsByRouteCollection.models[ 0 ];
        var vehicleLocationModel = modelUtility.vehiclesCollection.models[ 0 ];

        if ( ( typeof stopsModel === "object" ) && ( typeof vehicleLocationModel === "object" ) ) {
            if ( !( Defaults.mapLoaded ) ) {
                var centerMap = {};
                var kmlOptions = {};
                var kmlURL = "http://mbta-tracker.stromannet.com/kml/" + Defaults.route + ".kml?bust=" + Date.now();
                var lat = stopsModel.attributes.direction[ 0 ].stop[ 0 ].stop_lat;
                var lng = stopsModel.attributes.direction[ 0 ].stop[ 0 ].stop_lon;
                var map = {};
                var mapElement = {};
                var mapOptions = {};
                var mapZoom = 0;
                var mode = Defaults.mode;
                var routeLayer = null; // eslint-disable-line no-unused-vars
                var stops = modelUtility.stopsByRouteCollection.models[ 0 ].attributes.direction[ 0 ].stop;

                GoogleMapsLoader.KEY = Defaults.config.googleAPIKey;

                this.$el.html( mapsTemplate() );

                mapElement = document.getElementById( "map" );

                // Load Google Maps API.
                GoogleMapsLoader.load(function(google) {
                    centerMap = new google.maps.LatLng( lat, lng );

                    // Set map zoom depending on mode selected.
                    if ( mode === "bus" || mode === "subway" ) {
                        mapZoom = 12;
                    } else if ( mode === "commuter+rail" ) {
                        mapZoom = 8;
                    }

                    // Create map options object.
                    mapOptions = {
                        zoom: mapZoom,
                        center: centerMap,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };

                    map = new google.maps.Map( mapElement, mapOptions );

                    // Plot route stops.
                    mapUtility.plotRouteStops( stops, map );

                    // Set vehicle locations.
                    mapUtility.setVehicleLocations( vehicleLocationModel, map );

                    // KML layer options object.
                    kmlOptions = {
                        url: kmlURL,
                        suppressInfoWindows: true,
                        preserveViewport: true,
                        map: map
                    };

                    // Set KML layer.
                    routeLayer = new google.maps.KmlLayer( kmlOptions );

                    // Show map if everything loaded.
                    google.maps.event.addListenerOnce( map, "tilesloaded", function () {
                        Defaults.mapLoaded = true;


                        $( "#map" ).show();
                    } );      
                    
                    // Show coordinates in console if map clicked.
                    google.maps.event.addListener( map, "click", function ( event ) {
                        var e = event.latLng;
 
                        var lat = e.lat();
                        lat = lat.toFixed( 6 );

                        var lng = e.lng();
                        lng.toFixed( 6 );

                        console.log( "Latitude: " + lat + "  Longitude: " + lng );
                    } );

                    // Resize map if screen resized.
                    google.maps.event.addDomListener( window, "resize", function () {
                        var center = map.getCenter();
                        google.maps.event.trigger( map, "resize" );
                        map.setCenter( center );
                    } );

                });


            } else if ( Defaults.mapLoaded ) {
                mapUtility.updateVehicleLocations( vehicleLocationModel, map );
            }


            $(".btn-map-show").hide();
            $(".btn-map-hide").show();            

            this.$el.show();
        }

        predictionsUtility.fetchNewPredictions( modelUtility, this.options, true );

        return this;
    },


    close: function () {
        clearTimeout( Defaults.timer );
        Defaults.timer = null;

        Defaults.map = null;
        Defaults.mapLoaded = false;

        Defaults.predictionOptions = {};

        modelUtility.vehiclesCollection.reset();
        this.stopListening( modelUtility.vehiclesCollection );

        $(".btn-map-show").show();
        $(".btn-map-hide").hide();               

        this.$el.unbind();
        this.$el.hide();
    }
} );

module.exports = mapView;
