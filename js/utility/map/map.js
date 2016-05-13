//Map utility functions
define([], function() {
	"use strict";

	return {
		/**
		 * This function loops through the route object and plots all the stops on the map.
		 *
		 * @param  {Array} [stops] This array contains all the stops for the selected route.
		 * @param {Object} [map] The map element in the view.
		 * 
		 * @return {Object} The route plotted out on the map.
		 */
		plotRouteStops: function(stops, map) {
			var stopImage = "../../../img/red_stop.png";

			if ( Array.isArray(stops) ) {
				for ( var i = 0; i < stops.length; i++ ) {
					var marker = {};
					var myLatLng = {};
					var stopItem = {};

					stopItem = {
						stopID: stops[i].stop_id,
						title: stops[i].stop_name,
						lat: stops[i].stop_lat,
						lon: stops[i].stop_lon
					};

					myLatLng = new google.maps.LatLng(stopItem.lat, stopItem.lon);

					marker = new google.maps.Marker({
						position: myLatLng,
						map: map,
						title: stopItem.title,
						icon: stopImage
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
		setVehicleLocations: function(vehicles, map, markerLabel) {
			if ( typeof vehicles === "object" ) {
				var route = vehicles.attributes.route_name;
				var vehiclesModel = vehicles.attributes.direction;

				if ( Array.isArray(vehiclesModel) ) {
					for ( var i= 0; i < vehiclesModel.length; i++ ) {//Outer loop for direction array.
						for ( var j = 0; j < vehiclesModel[i].trip.length; j++ ) {//For trip array
							var myLatLon = {};
							var vehicle = {};
							var vehicleID =  vehiclesModel[i].trip[j].vehicle.vehicle_id;
							var vehicleLabel = "<b>Route " + route + "</b>: " + vehiclesModel[i].trip[j].trip_name;
							var vehicleLat = vehiclesModel[i].trip[j].vehicle.vehicle_lat;
							var vehicleLon = vehiclesModel[i].trip[j].vehicle.vehicle_lon;

							myLatLon = new google.maps.LatLng(vehicleLat, vehicleLon);

							vehicle = new markerLabel({
								position: myLatLon,
								map: map,
								vehicleID: vehicleID,
								labelContent: vehicleLabel,
								labelAnchor: new google.maps.Point(90, 75),
								labelClass: "map-marker-label"
							});

							Backbone.app.defaults.vehicles.push({
								vehicleID: vehicleID,
								marker: vehicle
							});							
						}
					}
				}
			}
		},

		updateVehicleLocations: function(vehicles, map, markerLabel) {
			var vehiclesModel = vehicles.attributes.direction;

			if ( Array.isArray(vehiclesModel) ) {
				for ( var i= 0; i < vehiclesModel.length; i++ ) {//Outer loop for direction array.
					for ( var j = 0; j < vehiclesModel[i].trip.length; j++ ) {//For trip array
						var myLatLon = {};
						var vehicle = {};
						var vehicleID =  vehiclesModel[i].trip[j].vehicle.vehicle_id;
						var vehicleLabel = vehiclesModel[i].trip[j].trip_name;
						var vehicleLat = vehiclesModel[i].trip[j].vehicle.vehicle_lat;
						var vehicleLon = vehiclesModel[i].trip[j].vehicle.vehicle_lon;

						_.find(Backbone.app.defaults.vehicles, function(item) {
							if ( item.vehicleID === vehicleID ) {
								item.marker.setPosition(
									new google.maps.LatLng(vehicleLat, vehicleLon)
								);
							}
						});
					}
				}
			}
		}
	}
});		