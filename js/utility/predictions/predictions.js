//Predictions utility functions to be shared.
define( [ "underscore", "utility/general/utility" ], function ( _, generalUtility ) {
    "use strict";

    return {

        /**
         * This will fetch updated predictions or vehicle locations and update them.
         *
         * @param  {Object} collections  The collections utility.
         * @param  {Object} fetchOptions THe fetch options for each collection being fetched.
         * @return {Object}              The updated collections.
         */
        fetchNewPredictions: function ( collections, fetchOptions ) {
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
                            data: fetchOptions.predictionOptions.data,
                            success: function () {
                                collections.vehiclesCollection.fetch( {
                                    traditional: true,
                                    data: fetchOptions.vehicleOptions.data
                                } );
                            }
                        } );
                    }, 20000 );
            } else {
                Backbone.app.defaults.timer =
                    setTimeout( function () {
                        collections.predictionsCollection.fetch( {
                            traditional: true,
                            data: fetchOptions.predictionOptions.data
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

        getPredictionsByRoute: function ( array, direction, stop ) {
            //console.log("getPredictionsByRoute: ");
            //console.log(array);
            var directionArr = array.direction;
            var predictions = [];
            var result = {};
            //console.log("stop: " + stop);

            for ( var i = 0; i < directionArr.length; i++ ) {
                if ( directionArr[i].direction_name.toLowerCase() === direction ) {
                    var tripArr = directionArr[i].trip;
                    for ( var j = 0; j < tripArr.length; j++ ) {
                        var predictionItem = {};
                        var stopsArr = tripArr[j].stop;
                        //console.log("stopsArr:");
                        //console.log(stopsArr);

                        _.findIndex(stopsArr, function(item) {
                            //console.log("item:");
                            //console.log(item);
                            //console.log(item.stop_id === stop);
                        });

                        /*predictionItem = _.findIndex(stopsArr, function(item) {
                            //console.log("findIndex:");
                            //console.log("item: ");
                            //console.log(item);
                            if ( item.stop_id === stop ) {
                                return item;
                            }
                        });

                        //console.log("predictionItem: ");
                        //console.log(predictionItem);

                        predictions.push(predictionItem);*/
                    }
                }
            }

            //console.log("predictions:");
           // console.log(predictions);

            return result;
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
