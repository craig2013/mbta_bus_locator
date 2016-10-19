//Predictions utility functions to be shared.
"use strict";
var _ = require("underscore");
var Backbone = require("backbone");
var Defaults = require("../../defaults");
var generalUtility = require("../general/utility");

var predictionsUtility = {
    /**
     * This will fetch updated predictions or vehicle locations and update them.
     *
     * @param  {Object} collections  The collections utility.
     * @param  {Object} fetchOptions The fetch options for each collection being fetched.
     * @return {Object}              The updated collections.
     */
    fetchNewPredictions: function ( collections ) {
        // var predictionOptions = ( typeof fetchOptions.predictionOptions !== "undefined" ) ? fetchOptions.predictionOptions : Backbone.app.defaults.predictionOptions;
        var showMap = Defaults.showMap;

        if ( Defaults.timer ) {
            clearTimeout( Defaults.timer );
            Defaults.timer = null;
        }

        if ( showMap === true ) {
            Defaults.timer =
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
            Defaults.timer =
                setTimeout( function () {
                    collections.predictionsCollection.fetch( {
                        traditional: true
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
        var currentDirection = [];
        var currentTrip = [];
        var direction = generalUtility.urlDecode( Defaults.direction );
        var i = 0;
        var j = 0;
        var k = 0;
        var otherRouteArr = [];
        var result = {};
        var route = generalUtility.urlDecode( Defaults.route );
        var selectedRouteArr = [];

        if ( Array.isArray( array ) ) { // Sort the predictions for the current route in ascending order.
            for ( i = 0; i < array.length; i++ ) {
                var currentRoute = array[ i ].route_id.toLowerCase();
                if ( route === currentRoute ) {
                    for ( j = 0; j < array[ i ].direction.length; j++ ) {
                        currentDirection = array[ i ].direction[ j ].direction_name.toLowerCase();
                        if ( direction === currentDirection ) {
                            for ( k = 0; k < array[ i ].direction[ j ].trip.length; k++ ) {
                                currentTrip = array[ i ].direction[ j ].trip[ k ];
                                currentTrip[ "route_name" ] = array[ i ].route_name;
                                currentTrip["first_vehicle"] = ( k === 0 ) ? true : false;

                                selectedRouteArr.push( currentTrip );
                            }
                        }
                    }
                    selectedRouteArr = _.flatten( selectedRouteArr );
                } else if ( route !== currentRoute ) { // Sort the predictions for other routes at the current stop in ascending order.
                    for ( j = 0; j < array[ i ].direction.length; j++ ) {
                        currentDirection = array[ i ].direction[ j ].direction_name.toLowerCase();
                        if ( direction === currentDirection ) {
                            for ( k = 0; k < array[ i ].direction[ j ].trip.length; k++ ) {
                                currentTrip = array[ i ].direction[ j ].trip[ k ];
                                currentTrip[ "route_name" ] = array[ i ].route_name;
                                currentTrip["first_vehicle"] = ( k === 0 ) ? true : false;

                                otherRouteArr.push( currentTrip );
                            }
                        }
                    }
                    otherRouteArr = _.flatten( otherRouteArr );
                }
            }

            otherRouteArr = this.sortPredictionOrderAsc( otherRouteArr );
            selectedRouteArr = this.sortPredictionOrderAsc( selectedRouteArr );

            result["selectedRoute"] = selectedRouteArr;
            result["otherRoute"] = otherRouteArr;
            
            result["showMapBtn"] = ( ( Array.isArray(result.selectedRoute) && result.selectedRoute.length >= 1 ) || ( Array.isArray(result.otherRoute) && result.otherRoute.length >= 1 ) ) ? true : false;

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
};

module.exports = predictionsUtility;