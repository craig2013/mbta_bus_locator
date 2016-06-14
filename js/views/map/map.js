//Map view
define( [
    "jquery",
    "chosen",
    "underscore",
    "backbone",
    "markerlabel",
    "utility/general/utility",
    "utility/map/map",
    "models/routes/routes",
    "models/stops/stops",
    "models/predictions/predictions",
    "models/vehicles/vehicles",
    "collections/routes/routes",
    "collections/stops/stops",
    "collections/predictions/predictions",
    "collections/vehicles/vehicles",
    "text!templates/map/map.html"
], function ( $, chosen, _, Backbone, markerLabel, generalUtility, mapUtility,
    routesModel, stopsModel, predictionsModel, vehiclesModel,
    routesCollection, stopsCollection, predictionsCollection, vehiclesCollection,
    mapsTemplate ) {

    "use strict";

    var mapView = Backbone.View.extend( {
        el: ".map-container",

        initialize: function () {
            clearTimeout( Backbone.app.defaultSettings.mapTimer );
            Backbone.app.defaultSettings.mapTimer = null;

            this.fetchVehicleLocations();

            this.listenTo( vehiclesCollection, "sync", this.render );
        },

        render: function () {
            var vehicleLocationModel = vehiclesCollection.models[ 0 ];
            var stopsModel = stopsCollection.models[ 0 ];

            if ( ( typeof stopsModel === "object" ) && ( typeof vehicleLocationModel === "object" ) ) {
                if ( !Backbone.app.defaults.mapLoaded ) {
                    var centerMap = {};
                    var direction = Backbone.app.defaults.direction;
                    var kmlOptions = {};
                    var kmlURL = null;
                    var lat = stopsModel.attributes.direction[ 0 ].stop[ 0 ].stop_lat;
                    var lng = stopsModel.attributes.direction[ 0 ].stop[ 0 ].stop_lon;
                    var map = {};
                    var mapElement = {};
                    var mapOptions = {};
                    var routeId = Backbone.app.defaults.route;
                    var routeLayer = null;
                    var stops = stopsCollection.models[ 0 ].attributes.direction[ 0 ].stop;
                    var template = _.template( mapsTemplate );

                    this.$el.html( template() );

                    mapElement = document.getElementById( "map" );

                    centerMap = new google.maps.LatLng( lat, lng );

                    mapOptions = {
                        zoom: 12,
                        center: centerMap,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    }

                    map = new google.maps.Map( mapElement, mapOptions );

                    mapUtility.plotRouteStops( stops, map );

                    mapUtility.setVehicleLocations( vehicleLocationModel, map, markerLabel );

                   kmlURL = "http://mbta-tracker.stromannet.com/kml/" + routeId + ".kml?bust="+Date.now();
                   kmlOptions = {
                        url: kmlURL,
                        suppressInfoWindows: true,
                        preserveViewport: true,
                        map: map
                    };
                    routeLayer = new google.maps.KmlLayer(kmlOptions);         

                    google.maps.event.addListenerOnce(map, "tilesloaded", function() {
                        console.log("Map has completed loading.");
                        Backbone.app.defaults.mapLoaded = true;

                
                        $( "#map" ).show();                         
                    });

;      
                    google.maps.event.addListener(map, 'click', function (event) {
                        var e = event.latLng;

                        var lat = e.lat();
                        lat = lat.toFixed(6);

                        var lng = e.lng();
                        lng.toFixed(6);

                        console.log("Latitude: " + lat + "  Longitude: " + lng);
                    });
                

                } else if ( Backbone.app.defaults.mapLoaded ) {
                    mapUtility.updateVehicleLocations( vehicleLocationModel, map, markerLabel );
                }

               /* google.maps.event.addDomListener( window, "resize", function () {
                    var center = map.getCenter();
                    google.maps.event.trigger( map, "resize" );
                    map.setCenter( center );
                } );*/

                /*if ( Backbone.app.defaults.mapLoaded ) {
                    $( ".show-map-link" ).hide();
                    $( ".hide-map-link" ).css( {
                        display: "block"
                    } );
                }*/

                //this.$( "#map" ).show();
                $( ".show-map-link" ).hide();
                $( ".hide-map-link" ).css( {
                    display: "block"
                } )
                this.$el.show();
            }

            return this;
        },

        fetchVehicleLocations: function () {
            var route = Backbone.app.defaults.route;
            var self = this;

            route = route.replace( "cr-", "CR-" ); // For commuter rail routes.

            route = generalUtility.titleCase( route );

            vehiclesCollection.fetch( {
                reset: true,
                data: {
                    "queryType": "vehiclesbyroute",
                    "queryString": "route",
                    "queryValue": route
                }
            } );

            Backbone.app.defaultSettings.mapTimer = setTimeout( function () {
                self.fetchVehicleLocations();
            }, Backbone.app.defaultSettings.refreshPredictionsTime );
        },


        close: function () {
            clearTimeout( Backbone.app.defaultSettings.mapTimer );
            Backbone.app.defaultSettings.mapTimer = null;

            Backbone.app.defaults.mapLoaded = false;

            vehiclesCollection.reset();
            this.stopListening( vehiclesCollection );

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
