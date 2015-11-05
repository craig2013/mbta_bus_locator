/**
 *
 * Function that returns a routes stops based on the direction selected.
 *
 **/
define( function () {
    'use strict';

    return {
        getBusRouteStops: function ( obj ) {
            var busRouteStopModel = obj.models[ 0 ].attributes;
            var busStops = obj.pluck( 'routeStops' );
            var busRouteStops = {
                'stops': []
            };

            if ( typeof busRouteStopModel === 'object' ) {
                //Create a new object that matches the stop tilte with the  stop info such as lat, lon etc.
                var results = _.map( busRouteStopModel.directionStops.stop, function ( obj ) {
                    var key = '';
                    var res = {};
                    var result = {};
                    var tag = obj.attributes.tag;
                    tag = tag.replace( '_ar', '' );
                    //Get the stops
                    var res = _.pick( busStops[ 0 ], function ( val, k ) {
                        if ( val.attributes.tag === tag ) {
                            var r = {};
                            key = k;

                            r = {
                                'lat': val.attributes.lat,
                                'lon': val.attributes.lon,
                                'stopId': val.attributes.stopId,
                                'tag': val.attributes.tag.replace( '_ar', '' ), //Some stops have _ar in the tag  so remove it if it exists.
                                'title': val.attributes.title,
                            };

                            return r;
                        }
                    } );
                    //Return attributes to results object
                    if ( typeof res === 'object' ) {
                        if ( typeof res[ key ] === 'object' ) {
                            if ( typeof res[ key ].attributes === 'object' ) {
                                result = {
                                    'attributes': {
                                        'tag': ( typeof res[ key ].attributes.tag === 'string' ) ? res[ key ].attributes.tag : '',
                                        'title': ( typeof res[ key ].attributes.title === 'string' ) ? res[ key ].attributes.title : '',
                                        'lat': ( typeof res[ key ].attributes.lat === 'string' ) ? res[ key ].attributes.lat : '',
                                        'lon': ( typeof res[ key ].attributes.lon === 'string' ) ? res[ key ].attributes.lon : '',
                                        'stopId': ( typeof res[ key ].attributes.stopId === 'string' ) ? res[ key ].attributes.stopId : ''
                                    }
                                };
                            } //typeof res[key].attributes === 'object'
                        } else {
                            //Return 'undefined' as a string for object if there are no attributes.
                            result = 'undefined';
                        } //typeof res[key] === 'object'
                    } //typeof res === 'object'

                    return result;
                } );

                busRouteStops.stops = results;

                return busRouteStops;
            }
        }
    };
} );
