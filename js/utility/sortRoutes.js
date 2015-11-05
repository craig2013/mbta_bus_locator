/**
 * Function that returns the predictions sorted for either the route selected or bus routes that also stop at the bus stop.
 *
 * @param {Object} The predictions object.
 *
 * @return {Array} The bus predictions containing an array of objects called predictions, an  array of obects called alsoAtStop, and showFooterDisclaimer.
 **/
define( [
    'jquery',
    'underscore',
    'backbone',
    'utility/getRouteName'
], function ( $, _, Backbone, getRouteNameUtility ) {

    'use strict';

    return {
        sortRoutes: function ( obj ) {

            var sortedPredictions = {
                'predictions': [],
                'alsoAtStop': [],
                'showFooterDisclaimer': false
            };

            _.map( obj.predictions, function ( o, i ) {
                var showDisclaimer = false;

                if ( typeof o.attributes.dirTitleBecauseNoPredictions === 'string' ) {
                    if ( o.attributes.routeTag === Backbone.app.defaults.routeNumber ) {
                        sortedPredictions.predictions.push( o );

                        if ( o.attributes.affectedByLayover === 'true' ) {
                            showDisclaimer = true;
                        }
                    } else {
                        //Set route name for display with Also at this stop
                        var routeNumber = ( typeof o.attributes.dirTag === 'string' ) ? o.attributes.dirTag.substring( 0, 3 ) : '';
                        var routeName = '';


                        if ( typeof getRouteNameUtility.getRouteName( routeNumber, 'longName' ) === 'string' ) {
                            routeName = getRouteNameUtility.getRouteName( routeNumber, 'longName' );
                        } else {
                            if ( typeof o.attributes.dirTag === 'string' ) {
                                routeName = o.attributes.dirTag.substring( 0, 3 ).replace( '_', ' ' );
                            } else {
                                routeName = '';
                            }
                        }

                        o.attributes[ 'routeName' ] = routeName;

                        if ( routeName ) {
                            sortedPredictions.alsoAtStop.push( o );
                        }
                    }
                } else {
                    //For also at this stop.
                    if ( o.attributes.dirTag.substring( 0, 3 ) === Backbone.app.defaults.directionVar.substring( 0, 3 ) ) {
                        sortedPredictions.predictions.push( o );

                        if ( o.attributes.affectedByLayover === 'true' ) {
                            showDisclaimer = true;
                        }
                    } else {
                        //Set route name for display with Also at this stop
                        var routeNumber = ( typeof o.attributes.dirTag === 'string' ) ? o.attributes.dirTag.substring( 0, 3 ) : '';
                        var routeName = '';

                        if ( typeof getRouteNameUtility.getRouteName( routeNumber, 'longName' ) === 'string' ) {
                            routeName = getRouteNameUtility.getRouteName( routeNumber, 'longName' );
                        } else {
                            if ( typeof o.attributes.dirTag === 'string' ) {
                                routeName = o.attributes.dirTag.substring( 0, 3 ).replace( '_', ' ' );
                            } else {
                                routeName = '';
                            }
                        }

                        o.attributes[ 'routeName' ] = routeName;

                        sortedPredictions.alsoAtStop.push( o );
                    }
                }

                if ( showDisclaimer ) {
                    if ( Array.isArray( sortedPredictions.predictions ) ) {
                        sortedPredictions.showFooterDisclaimer = true;
                    }
                }

            } );

            return sortedPredictions;
        }
    };
} );
