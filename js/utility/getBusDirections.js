/**
 * Function that returns directions available for a selected stop.
 *
 * @param {Object} This is the predictions object.
 *
 * @return {Object} The directions for a selected stop.
 **/
define( function () {
    'use strict';

    return {
        getBusDirections: function ( obj ) {
            var busDirections = obj.models;
            var result = [];

            _.each( busDirections, function ( obj ) {
                if ( typeof obj.attributes !== 'undefined' ) {
                    if ( typeof obj.attributes.attributes !== 'undefined' ) {
                        result.push( obj.attributes.attributes );
                    }
                }
            } );

            if ( Array.isArray( result ) ) {
                result.sort( function ( a, b ) {
                    if ( a.title < b.title ) {
                        return -1;
                    }

                    if ( a.title > b.title ) {
                        return 1;
                    }

                    return 0;
                } );
            }

            return result;
        }
    };
} );
