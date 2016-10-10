//Map view
define( [
    "jquery",
    "chosen",
    "underscore",
    "backbone",
    "markerlabel",
    "utility/general/utility",
    "utility/predictions/predictions",
    "utility/map/map",
    "utility/models/models",
    "text!templates/map/map.html"
], function ( $, chosen, _, Backbone, markerLabel, generalUtility, predictionsUtility, mapUtility, modelUtility, mapsTemplate ) {

    "use strict";

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
                if ( !( Backbone.app.defaults.mapLoaded ) ) {
                    var centerMap = {};
                    var kmlOptions = {};
                    var kmlURL = null;
                    var lat = stopsModel.attributes.direction[ 0 ].stop[ 0 ].stop_lat;
                    var lng = stopsModel.attributes.direction[ 0 ].stop[ 0 ].stop_lon;
                    var map = {};
                    var mapElement = {};
                    var mapOptions = {};
                    var mapZoom = 0;
                    var mode = Backbone.app.defaults.mode;
                    var routeId = Backbone.app.defaults.route;
                    var routeLayer = null; // eslint-disable-line no-unused-vars
                    var stops = modelUtility.stopsByRouteCollection.models[ 0 ].attributes.direction[ 0 ].stop;
                    var template = _.template( mapsTemplate );

                    this.$el.html( template() );

                    mapElement = document.getElementById( "map" );

                    centerMap = new google.maps.LatLng( lat, lng );

                    if ( mode === "bus" || mode === "subway" ) {
                        mapZoom = 12;
                    } else if ( mode === "commuter+rail" ) {
                        mapZoom = 8;
                    }


                    mapOptions = {
                        zoom: mapZoom,
                        center: centerMap,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };

                    map = new google.maps.Map( mapElement, mapOptions );

                    mapUtility.plotRouteStops( stops, map );

                    mapUtility.setVehicleLocations( vehicleLocationModel, map, markerLabel );

                    kmlURL = "http://mbta-tracker.stromannet.com/kml/" + routeId + ".kml?bust=" + Date.now();

                    kmlOptions = {
                        url: kmlURL,
                        suppressInfoWindows: true,
                        preserveViewport: true,
                        map: map
                    };
                    routeLayer = new google.maps.KmlLayer( kmlOptions );

                    google.maps.event.addListenerOnce( map, "tilesloaded", function () {
                        Backbone.app.defaults.mapLoaded = true;


                        $( "#map" ).show();
                    } );

                    google.maps.event.addListener( map, "click", function ( event ) {
                        var e = event.latLng;

                        var lat = e.lat();
                        lat = lat.toFixed( 6 );

                        var lng = e.lng();
                        lng.toFixed( 6 );

                        console.log( "Latitude: " + lat + "  Longitude: " + lng );
                    } );


                } else if ( Backbone.app.defaults.mapLoaded ) {
                    mapUtility.updateVehicleLocations( vehicleLocationModel, map, markerLabel );
                }

                google.maps.event.addDomListener( window, "resize", function () {
                    var center = map.getCenter();
                    google.maps.event.trigger( map, "resize" );
                    map.setCenter( center );
                } );

                $( ".show-map-link" ).hide();
                $( ".hide-map-link" ).css( {
                    display: "block"
                } );

                this.$el.show();
            }

            predictionsUtility.fetchNewPredictions( modelUtility, this.options, true );

            return this;
        },


        close: function () {
            clearTimeout( Backbone.app.defaults.timer );
            Backbone.app.defaults.timer = null;

            Backbone.app.defaults.map = null;
            Backbone.app.defaults.mapLoaded = false;

            Backbone.app.defaults.predictionOptions = {};

            modelUtility.vehiclesCollection.reset();
            this.stopListening( modelUtility.vehiclesCollection );

            $( ".hide-map-link" ).hide();
            $( ".show-map-link" ).css( {
                display: "block"
            } );

            this.$el.unbind();
            this.$el.hide();
        }
    } );

    return mapView;
} );
