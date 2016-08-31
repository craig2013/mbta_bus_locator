//Predictions utility functions to be shared.
define( [ "jquery", "underscore", "backbone", "utility/general/utility" ], function ( $, _, Backbone, generalUtility ) {
    "use strict";

    return {

        /**
         * This will fetch updated predictions or vehicle locations and update them.
         *
         * @param  {Object} collections  The collections utility.
         * @param  {Object} fetchOptions The fetch options for each collection being fetched.
         * @return {Object}              The updated collections.
         */
        fetchNewPredictions: function ( collections /*, fetchOptions */ ) {
            // var predictionOptions = ( typeof fetchOptions.predictionOptions !== "undefined" ) ? fetchOptions.predictionOptions : Backbone.app.defaults.predictionOptions;
            var showMap = Backbone.app.defaults.showMap;

            if ( Backbone.app.defaults.timer ) {
                clearTimeout( Backbone.app.defaults.timer );
                Backbone.app.defaults.timer = null;
            }

            if ( showMap === true ) {
                Backbone.app.defaults.timer =
                    setTimeout( function () {
                        collections.predictionsCollection.fetch( {
                            traditional: true,
                            success: function () {
                                collections.vehiclesCollection.fetch( {
                                    traditional: true
                                } );
                            }
                        } );
                    }, 20000 );
            } else {
                Backbone.app.defaults.timer =
                    setTimeout( function () {
                        collections.predictionsCollection.fetch( {
                            traditional: true,
                        } );
                    }, 20000 );
            }
        },
        /**
         * Get's the predictions based on the prediction model passed into the function.
         *
         * @param  {Array} array The predictions model array.
         * @return {Array} An array of array's that contains the predictions objects.
         */
        getPredictionsByStop: function ( array ) {
            var direction = generalUtility.urlDecode( Backbone.app.defaults.direction );
            var otherRouteArr = [];
            var result = [];
            var route = generalUtility.urlDecode( Backbone.app.defaults.route );
            var selectedRouteArr = [];

            if ( Array.isArray( array ) ) { // Sort the predictions for the current route in ascending order.
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
                    } else if ( route !== currentRoute ) { // Sort the predictions for other routes at the current stop in ascending order.
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
         * @param  {Array} array The predictions model array.
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
         * @param  {Array} array The predictions model array.
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
