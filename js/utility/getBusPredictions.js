/**
 * Function that returns the predictions for a stop after a direction is chosen.
 *
 * @param {Object} This is the predictions object.
 *
 * @return {Object||Array} The bus predictions as either an object or an array of objects.
 **/
define( function () {
    'use strict';

    /* TODO: Test route info on all route types. */
    return {
        getBusPredictions: function ( obj ) {
            var busPredictions = obj;
            var predictionsData = {
                'predictions': [],
                'routeInfo': []
            };

            if ( Array.isArray( busPredictions ) ) { //Multiple predictions for a stop
                predictionsData.predictions = _( busPredictions )
                    .chain()
                    .flatten()
                    .pluck( 'direction' )
                    .without( undefined )
                    .flatten()
                    .pluck( 'prediction' )
                    .flatten()
                    .without( undefined )
                    .value();

                //Test if no predictions exist for a route
                var noPredictions = _.find( busPredictions, function ( obj ) {
                    return ( typeof obj.attributes.dirTitleBecauseNoPredictions === 'string' ) ? obj.attributes.dirTitleBecauseNoPredictions : '';
                } );

                if ( typeof noPredictions === 'object' ) {
                    predictionsData.predictions.push( noPredictions );
                }


                var routeInfoObj = _.map( busPredictions, function ( obj ) {
                    var result = {};

                    result = obj.attributes;

                    if ( typeof obj.direction === 'object' ) {
                        if ( typeof obj.direction.attributes === 'object' ) {
                            result[ 'routeDirection' ] = obj.direction.attributes.title;
                        }
                    }


                    return result;
                } );

                predictionsData.routeInfo = routeInfoObj;

            } else if ( Array.isArray( busPredictions.direction ) ) { //Multiple directions for a stop
                predictionsData.predictions = _( busPredictions.direction )
                    .chain()
                    .flatten()
                    .pluck( 'prediction' )
                    .value();

                predictionsData.routeInfo = _( busPredictions.direction )
                    .chain()
                    .flatten()
                    .pluck( 'attributes' )
                    .without( undefined )
                    .value();

            } else if ( typeof busPredictions.direction === 'object' && !Array.isArray( busPredictions.direction ) ) { //Only 1 direction for stop
                if ( Array.isArray( busPredictions.direction.prediction ) ) { //Multiple predictions for a direction
                    predictionsData.predictions = _.flatten( busPredictions.direction.prediction );
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
