/**
 * Function that returns the predictions for a stop after a direction is chosen.
 *
 * @param {Object} This is the predictions object.
 *
 * @return {Object||Array} The bus predictions as either an object or an array of objects.
 **/
define( function () {
    'use strict';

    return {
        getBusPredictions: function ( obj ) {
            var busPredictions = obj;
            var predictionsData = {
                'predictions': []
            };


            if ( Array.isArray( busPredictions ) ) { //Multiple predictions for a stop

                //Test if no predictions exist for a route
                var noPredictions = _.find( busPredictions, function ( obj ) {
                    return ( typeof obj.attributes.dirTitleBecauseNoPredictions === 'string' ) ? obj.attributes.dirTitleBecauseNoPredictions : '';
                } );

                if ( typeof noPredictions === 'object' ) {
                    predictionsData.predictions.push( noPredictions );
                }

                var res = _( busPredictions ).chain().
                flatten().
                pluck( 'direction' ).
                without( undefined ).
                flatten().
                pluck( 'prediction' ).
                flatten().
                without( undefined );


                if ( typeof res === 'object' ) {
                    if ( Array.isArray( res._wrapped ) ) {
                        predictionsData.predictions = res._wrapped;
                    } else {
                        predictionsData.predictions.push( res._wrapped );

                    }
                }
            } else if ( Array.isArray( busPredictions.direction ) ) { //Multiple directions for a stop
                var res = _( busPredictions.direction ).chain().
                flatten().
                pluck( 'prediction' );

                if ( typeof res === 'object' ) {
                    if ( Array.isArray( res._wrapped ) ) {
                        predictionsData.predictions = res._wrapped;
                    } else {
                        predictionsData.predictions.push( res._wrapped );
                    }
                }

            } else if ( typeof busPredictions.direction === 'object' && !Array.isArray( busPredictions.direction ) ) { //Only 1 direction for stop
                if ( Array.isArray( busPredictions.direction.prediction ) ) {
                    for ( var i = 0; i < busPredictions.direction.prediction.length; i++ ) { //Multiple predictions for a direction
                        predictionsData.predictions.push( busPredictions.direction.prediction[ i ] );
                    }
                } else if ( ( typeof busPredictions.direction.prediction === 'object' ) && ( !Array.isArray( busPredictions.direction.prediction ) ) ) {
                    predictionsData.predictions.push( busPredictions.direction.prediction );
                }
            } else if ( typeof obj.attributes === 'object' && typeof obj.attributes.dirTitleBecauseNoPredictions === 'string' ) { //No bus predictions for selected stop and/or route 

                predictionsData.predictions.push( obj );
            }

            return predictionsData;
        }
    };
} );
