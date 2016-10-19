//Map utility functions
"use strict";
var _ = require("underscore");
var Defaults = require("../../defaults");
var GoogleMapsLoader = require("google-maps");

var mapUtility = {
    /**
     * This function loops through the route object and plots all the stops on the map.
     *
     * @param  {Array} [stops] This array contains all the stops for the selected route.
     * @param {Object} [map] The map element in the view.
     *
     * @return {Object} The route plotted out on the map.
     */
    plotRouteStops: function ( stops, map ) {
        var stopImage = "../img/red_stop.png";

        if ( Array.isArray( stops ) ) {
            for ( var i = 0; i < stops.length; i++ ) {
                var stopItem = {
                    stopID: stops[ i ].stop_id,
                    title: stops[ i ].stop_name,
                    lat: stops[ i ].stop_lat,
                    lon: stops[ i ].stop_lon
                };

                GoogleMapsLoader.KEY = Defaults.config.googleAPIKey;

                GoogleMapsLoader.load(function(google) {

                    var myLatLng = new google.maps.LatLng( stopItem.lat, stopItem.lon );

                    var marker = new google.maps.Marker( { // eslint-disable-line no-unused-vars
                        position: myLatLng,
                        map: map,
                        title: stopItem.title,
                        icon: stopImage
                    } );
                });
            }
        }
    },

    /**
     * Sets the vehicle locations on the map according to their lat, lon positions.
     *
     * @param {Array} [vehicles] An array of vehicle objects.
     * @param {Object} [map] The map element to add the vehicle locations to.
     */
    setVehicleLocations: function ( vehicles, map ) {
        var markerLabel = require("markerwithlabel")(google.maps);

        if ( typeof vehicles === "object" ) {
            var i = 0;
            var j = 0;
            var myLatLon = {};
            var route = vehicles.attributes.route_name;
            var vehiclesModel = vehicles.attributes.direction;
            var vehicle = {};
            var vehicleID = "";
            var vehicleLabel = "";
            var vehicleLat = "";
            var vehicleLon = "";

            GoogleMapsLoader.KEY = Defaults.config.googleAPIKey;

            GoogleMapsLoader.load(function(google) {

                if ( Array.isArray( vehiclesModel ) ) {
                    for ( i = 0; i < vehiclesModel.length; i++ ) { //Outer loop for direction array.
                        for ( j = 0; j < vehiclesModel[ i ].trip.length; j++ ) { //For trip array
                            vehicleID = vehiclesModel[ i ].trip[ j ].vehicle.vehicle_id;

                            vehicleLabel = "<b>Route " + route + "</b>: " + vehiclesModel[ i ].trip[ j ].trip_name;

                            vehicleLat = vehiclesModel[ i ].trip[ j ].vehicle.vehicle_lat;

                            vehicleLon = vehiclesModel[ i ].trip[ j ].vehicle.vehicle_lon;

                            myLatLon = new google.maps.LatLng( vehicleLat, vehicleLon );

                            vehicle = {};

                            vehicle = new markerLabel( {
                                position: myLatLon,
                                map: map,
                                vehicleID: vehicleID,
                                labelContent: vehicleLabel,
                                labelAnchor: new google.maps.Point( 90, 75 ),
                                labelClass: "map-marker-label"
                            } );

                            Defaults.vehicles.push( {
                                vehicleID: vehicleID,
                                marker: vehicle
                            } );
                        }
                    }
                } else {
                    route = vehicles.attributes.route_name;
                    vehiclesModel = vehicles.attributes.trip;
                    var vehiclesModelLength = vehiclesModel.length;

                    for ( i = 0; i < vehiclesModelLength; i++ ) { //For trip array
                        vehicleID = vehiclesModel[ i ].vehicle.vehicle_id;

                        vehicleLabel = "<b>Route " + route + "</b>: " + vehiclesModel[ i ].trip_name;
                        
                        vehicleLat = vehiclesModel[ i ].vehicle.vehicle_lat;
                        
                        vehicleLon = vehiclesModel[ i ].vehicle.vehicle_lon;                       

                        myLatLon = new google.maps.LatLng( vehicleLat, vehicleLon );

                        vehicle = {};

                        vehicle = new markerLabel( {
                            position: myLatLon,
                            map: map,
                            vehicleID: vehicleID,
                            labelContent: vehicleLabel,
                            labelAnchor: new google.maps.Point( 90, 75 ),
                            labelClass: "map-marker-label"
                        } );

                        Defaults.vehicles.push( {
                            vehicleID: vehicleID,
                            marker: vehicle
                        } );
                    }
                }
            });
        }
    },

    updateVehicleLocations: function ( vehicles, map ) {// eslint-disable-line no-unused-vars 
        var markerLabel = require("markerwithlabel")(google.maps);// eslint-disable-line no-unused-vars
        var vehiclesModel = vehicles.attributes.direction;
        GoogleMapsLoader.KEY = "AIzaSyAtOuyfhO2wJAe1R1NnpigAPeEUXDTyxXE";

        if ( Array.isArray( vehiclesModel ) ) {
            for ( var  i = 0; i < vehiclesModel.length; i++ ) { //Outer loop for direction array.
                for ( var j = 0; j < vehiclesModel[ i ].trip.length; j++ ) { //For trip array
                    var vehicle = {}; // eslint-disable-line no-unused-vars
                    var vehicleID = vehiclesModel[ i ].trip[ j ].vehicle.vehicle_id;
                    var vehicleLat = vehiclesModel[ i ].trip[ j ].vehicle.vehicle_lat;
                    var vehicleLon = vehiclesModel[ i ].trip[ j ].vehicle.vehicle_lon;

                    _.find( Defaults.vehicles, function ( item ) {
                        if ( item.vehicleID === vehicleID ) {
            

                            GoogleMapsLoader.load(function(google) {                            
                                item.marker.setPosition(
                                    new google.maps.LatLng( vehicleLat, vehicleLon )
                                );
                            });
                        }
                    } );
                }
            }
        }
    }
};

module.exports = mapUtility;