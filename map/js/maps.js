(function() {
    'use strict';

    var busMap = {
        init: function() {
            var agency = this.getQueryVariable('a');
            var direction = this.getQueryVariable('d');
            var route = this.getQueryVariable('r');
            var stop = this.getQueryVariable('s');
            var info = {
                'agency': agency,
                'direction': direction,
                'route': route,
                'stop': stop
            };

            //Initialize Google maps and center map on Boston
            this.setMap(42.358056, -71.063611, 11);

            this.getRoute(info);
        },
        /**
        * getRoute: Function that gets route information.
        * 
        * @param info This is an object that contains agency, direction, route number,  and stop id.
        * 
        * @return The selected route bus stops.
        **/
        getRoute: function(info) {  
            var self = this;

            $.ajax({
                type: 'GET',
                url: '../../app/?command=routeConfig&agency=' + info.agency + '&route=' + info.route,
                dataType: 'json',
                success: function (response) {
                    if ( typeof response.route !== undefined ) {
                        if ( typeof response.route.attributes !== undefined ) {
                            var centerLat = ( typeof response.route.attributes.latMin === 'string' ) ? response.route.attributes.latMin : '';
                            var centerLon = ( typeof response.route.attributes.lonMin === 'string' ) ? response.route.attributes.lonMin : '';

                           var map = self.setMap(centerLat, centerLon, 13);

                            self.plotRouteStops(response.route.stop, map, info);
                        }
                    }
                }
            });
        },
        /**
        * plotRouteStops: Function that plots the route stops on the map.
        * 
        * @param stops This is an adrray of objects that contains the info on a stop such as the lat/lng.
        * @param map This is an object that represents the map displayed.
        * @param info This is an object that contains agency, direction, route number,  and stop id.
        * 
        * @return The bus route stops are plotted on the map.
        **/
        plotRouteStops: function(stops, map, info) {
            var stopImage = '../../img/red_stop.png';

            for ( var i = 0; i < stops.length; i++ ) {
                if ( !isNaN(stops[i].attributes.lat) && !isNaN(stops[i].attributes.lon) ) {
                    var marker = {};
                    var myLatLng = {};
                    var stopObj = {
                            'stopID': stops[i].attributes.stopId,
                            'title': stops[i].attributes.title,
                            'lat': stops[i].attributes.lat,
                            'lon': stops[i].attributes.lon
                    };
                    
                    myLatLng = new google.maps.LatLng(stopObj.lat, stopObj.lon);


                    marker = new google.maps.Marker({
                        position: myLatLng,
                        map: map,
                        title: stopObj.title,
                        icon: stopImage
                    });
                 
                }
            }

             this.setBusLocations(info, map);
        },
        /**
        * setBusLocations: Function that plots the route stops on the map.
        * 
        * @param stops This is an adrray of objects that contains the info on a stop such as the lat/lng.
        * @param map This is an object that represents the map displayed.
        * @param info This is an object that contains agency, direction, route number,  and stop id.
        * 
        * @return The buses are displayed on the map represented as markers.
        **/
        setBusLocations: function(info, map) {
            var buses = [];
            var self = this;

            $.ajax({
                type: 'GET',
                url: '../../app/?command=vehicleLocations&agency=' + info.agency + '&route=' + info.route + '&t=',
                dataType: 'json',
                success: function (response) {   
                    if ( typeof response === 'object' ) {
                        if ( typeof response.vehicle !== 'undefined' ) {
                            var vehicle = response.vehicle;

                            if ( Array.isArray(vehicle) ) {
                                for ( var i = 0; i < vehicle.length; i++ ) {
                                    var lat = vehicle[i].attributes.lat;
                                    var lon = vehicle[i].attributes.lon;
                                    var busId = vehicle[i].attributes.id;
                                    var myLatLon = new google.maps.LatLng(lat, lon);
                                    var bus = {};

                                    bus = new google.maps.Marker({
                                        position: myLatLon,
                                        map: map,
                                        busId: busId
                                    });

                                    buses.push({
                                        'busId': busId,
                                        'marker': bus
                                    });                                  
                                }
                            } else {
                                if ( !isNaN(vehicle.attributes.lat) && !isNaN(vehicle.attributes.lon) ) {
                                    var lat = vehicle.attributes.lat;
                                    var lon = vehicle.attributes.lon;
                                    var busId = vehicle.attributes.id;
                                    var myLatLon = new google.maps.LatLng(lat, lon);
                                    var bus = {};

                                    bus = new google.maps.Marker({
                                        position: myLatLon,
                                        map: map,
                                        busId: busId
                                    });

                                   buses.push({
                                        'busId': busId,
                                        'marker': bus
                                    });
                                }
                            } //end Array.isArray(vehicle)

                            setInterval(function () { //Refresh marker locations every 20 seconds
                                self.updateBusLocations(info, map, buses);
                            }, 20000);

                        }
                    }       
                }
            });   
        },
        /**
        * updateBusLocations: Function that moves bus markers when there location is updated.
        * 
        * @param info This is an object that contains agency, direction, route number,  and stop id.
        * @param map This is an object that represents the map displayed.
        * @param buses An object that is either a single object or an array of objects that are the buses displayed as markers on the map.
        * 
        * @return The bus locations are updated.
        **/
        updateBusLocations: function(info, map, buses) {
            $.ajax({
                type: 'GET',
                url: '../../app/?command=vehicleLocations&agency=' + info.agency + '&route=' + info.route,
                dataType: 'json',
                success: function (response) {
                    if (typeof response === 'object') {
                        var vehicle = response.vehicle;
                        if ( Array.isArray(vehicle) ) {

                            for ( var i = 0; i < vehicle.length; i++ ) {
                                var lat = '';
                                var lon = '';
                                var busId = '';
                                var lastTime = '';
                                var bus = '';
                                var updatedBus = '';
                                var busObj = '';
                                var vehicleObj = buses;

                                if ( !isNaN(vehicle[i].attributes.lat) && !isNaN(vehicle[i].attributes.lon) ) {
                                    lat = vehicle[i].attributes.lat;
                                    lon = vehicle[i].attributes.lon;
                                    busId = vehicle[i].attributes.id;

                                    $.map(vehicleObj, function (obj, i) {
                                        if (obj.busId == busId) {
                                            obj.marker.setPosition(new google.maps.LatLng(lat, lon));
                                        }
                                    });                                    
                                }
                            }

                        } else {
                            var vehicle = ( typeof response.vehicle === 'object' ) ? response.vehicle : {};
                            var lat = '';
                            var lon = '';
                            var busId = '';
                            var lastTime = '';
                            var bus = '';
                            var updatedBus = '';
                            var busObj = '';
                            var vehicleObj = buses;

                            if ( vehicle.attributes.lat !== undefined && vehicle.attributes.lon !== undefined ) {
                                if ( !isNaN(vehicle.attributes.lat) && !isNaN(vehicle.attributes.lon) ) {
                                    lat = vehicle.attributes.lat;
                                    lon = vehicle.attributes.lon;
                                    busId = vehicle.attributes.id;
                                    $.map(vehicleObj, function (obj, i) {
                                        if (obj.busId === busId) {
                                            obj.marker.setPosition(new google.maps.LatLng(lat, lon));
                                        }
                                    });                                
                                }
                            }

                        } //end Array.isArray(vehicle)
                    }
                }
            });            
        },
        /**
        * setMap: Function that sets the map displayed.
        * 
        * @param lat This is a number that represents the latitude.
        * @param lng This is a number that represents the longitude.
        * @param zoom This is a number that represents how closely the map is zoomed into a location.  The lower the number, the map is zoomed out more.  The higer the number the map is zoomed in more.
        * 
        * @return The map object.
        **/
        setMap: function(lat, lng, zoom) {
            var mapElement = document.getElementById('mapCanvas');
            var map = {};
            var mapOptions = {};

            mapOptions = {
                zoom: zoom,
                center: new google.maps.LatLng(lat, lng),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            map = new google.maps.Map(mapElement, mapOptions);

            return map;               
        },
        /**
        * getQueryVariable: Function that get's a querystring parameter from the URL.
        * 
        * @param v This is a string that represents the querystring parameter your looking for,
        * 
        * @return The querystring parameter when a match is found.
        **/
        getQueryVariable: function(v) {
            var query = window.location.search.substring(1);
            var vars = query.split('&');
            for ( var i=0; i < vars.length; i++ ) {
                var pair = vars[i].split('=');

                if ( pair[0] === v ) {
                    return pair[1];
                }
            }

            return false;
        }
    };

    busMap.init();


    /**
    * Function is pollyfil for isArray for testing if a object is an array.
    * 
    * 
    * @return True if object is an array or false if it isn't.
    */
    if ( !Array.isArray ) {
      Array.isArray = function(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
      };
    }
    
})();