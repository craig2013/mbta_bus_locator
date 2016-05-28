//Predictions utility functions to be shared.
define( [ "underscore", "utility/general/utility" ], function ( _, generalUtility ) {
    "use strict";

    return {

        /**
         * Get's the predictions based on the prediction model passed into the function.
         *
         * @param  {Array} (array) The predictions model array.
         * @return {Array} An array of array's that contains the predictions objects.
         */
        getPredictions: function ( array ) {
            var direction = generalUtility.urlDecode( Backbone.app.defaults.direction );
            var otherRouteArr = [];
            var result = [];
            var route = generalUtility.urlDecode( Backbone.app.defaults.route );
            var selectedRouteArr = [];

            if ( Array.isArray( array ) ) {
                for ( var i = 0; i < array.length; i++ ) {
                    var currentRoute = array[ i ].route_id.toLowerCase();
                    if ( route === currentRoute ) {
                        for ( var j = 0; j < array[ i ].direction.length; j++ ) {
                            var currentDirection = array[ i ].direction[ j ].direction_name.toLowerCase();
                            if ( direction === currentDirection ) {
                                for ( var k = 0; k < array[ i ].direction[ j ].trip.length; k++ ) {
                                    var currentTrip = array[ i ].direction[ j ].trip[ k ];
                                    currentTrip[ "route_name" ] = array[ i ].route_name;

                                    selectedRouteArr.push( currentTrip );
                                }
                            }
                        }
                        selectedRouteArr = _.flatten( selectedRouteArr );
                    } else if ( route !== currentRoute ) {
                        for ( var j = 0; j < array[ i ].direction.length; j++ ) {
                            var currentDirection = array[ i ].direction[ j ].direction_name.toLowerCase();
                            if ( direction === currentDirection ) {
                                for ( var k = 0; k < array[ i ].direction[ j ].trip.length; k++ ) {
                                    var currentTrip = array[ i ].direction[ j ].trip[ k ];
                                    currentTrip[ "route_name" ] = array[ i ].route_name;

                                    otherRouteArr.push( currentTrip );
                                }
                            }
                        }
                        otherRouteArr = _.flatten( otherRouteArr );
                    }
                }

                otherRouteArr = this.sortPredictionOrderAsc( otherRouteArr );
                selectedRouteArr = this.sortPredictionOrderAsc( selectedRouteArr );

                result.push( selectedRouteArr );
                result.push( otherRouteArr );

                return result;
            }
        },

        /**
         * Sorts the predictions in ascending order.
         *
         * @param  {Array} (array) The predictions model array.
         * @return {Array}  The sorted predictions array.
         */
        sortPredictionOrderAsc: function ( array ) {
            if ( Array.isArray( array ) ) {
                array.sort( function ( a, b ) {
                    return generalUtility.convertTime( a.pre_away ) - generalUtility.convertTime( b.pre_away );
                } );
            }

            return array;
        },

        /**
         * Sorts the predictions in descending order.
         *
         * @param  {Array} (array) The predictions model array.
         * @return {Array}  The sorted predictions array.
         */
        sortPredictionOrderDsc: function ( array ) {
            if ( Array.isArray( array ) ) {
                if ( Array.isArray( array[ 0 ].direction ) ) {
                    if ( Array.isArray( array[ 0 ].direction[ 0 ].trip ) ) {
                        array[ 0 ].direction[ 0 ].trip.sort( function ( a, b ) {
                            return generalUtility.convertTime( b.pre_away ) - generalUtility.convertTime( a.pre_away );
                        } );
                    }
                }
            }

            return array;
        }

    }

} );
