/**
 * Function that returns predictions sorted in ascending order by minutes until the bus arrives at a stop.
 *
 * @param {Object} This is the predictions object.
 *
 * @return {Object} The bus predictions object containing sorted predictions.
 **/
define( function () {
    'use strict';

    return {
        sortPredictions: function ( obj ) {
            obj.sort( function ( a, b ) {

                //Test if a.attributes or b.attributes, and a.attributes.dirTag or b.attributes.dirTag exists first
                if ( typeof a.attributes === 'undefined' || typeof a.attributes.dirTag === 'undefined' || typeof a.attributes.minutes === 'undefined' ) {
                    return 1;
                }

                if ( typeof b.attributes === 'undefined' || typeof b.attributes.dirTag === 'undefined' || typeof b.attributes.minutes === 'undefined' ) {
                    return 0;
                }

                //Dirtag and minutes for a
                var aDirTag = parseInt( a.attributes.dirTag.substring( 0, a.attributes.dirTag.indexOf( '_' ) ) );
                var aMin = parseInt( a.attributes.minutes );

                //Dirtag and minutes for b
                var bDirTag = parseInt( b.attributes.dirTag.substring( 0, b.attributes.dirTag.indexOf( '_' ) ) );
                var bMin = parseInt( b.attributes.minutes );

                return ( aDirTag === bDirTag ) ? aMin - bMin : aDirTag - bDirTag;
            } );

            return obj;
        }
    };
} );
