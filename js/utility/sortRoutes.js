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
                'alsoAtStop': [], //Template issue when switching routes is with this.  It's still filled with previous values.
                'showFooterDisclaimer': false
            };

            sortedPredictions.predictions = [];
            sortedPredictions.alsoAtStop = [];

            _.map( obj.predictions, function ( o, i ) {
                var showDisclaimer = false;

                if ( typeof o.attributes.dirTitleBecauseNoPredictions === 'string' ) { //No predictions
                    if ( o.attributes.routeTag === Backbone.app.defaults.routeNumber ) {
                        sortedPredictions.predictions.push( o );
                    }
                } else {
                    var dirTag = ( typeof o.attributes.dirTag === 'string' ) ? o.attributes.dirTag.substring( 0, 3 ) : '';
                    var routeNumber = ( typeof o.attributes.dirTag === 'string' ) ? o.attributes.dirTag.substring( 0, 3 ) : '';
                    var selectedRouteDirTag = ( typeof Backbone.app.defaults.directionVar === 'string' ) ? Backbone.app.defaults.directionVar.substring( 0, 3 ) : '';

                    if ( dirTag === selectedRouteDirTag ) { //Predictions for selected route
                        sortedPredictions.predictions.push( o );

                        if ( o.attributes.affectedByLayover === 'true' ) {
                            showDisclaimer = true;
                        }


                    } else { //Predictions for also at stop
                        var currentRouteNumber = routeNumber.replace( '_', '' );
                        var currentRouteInfo = _.find( obj.routeInfo, function ( item ) {
                            return ( item.routeTag === currentRouteNumber ) ? item : undefined;
                        } );

                        o.attributes[ 'routeNumber' ] = currentRouteNumber;
                        o.attributes[ 'routeTitle' ] = ( typeof currentRouteInfo.routeTitle === 'string' ) ? currentRouteInfo.routeTitle : '';
                        o.attributes[ 'routeDirection' ] = ( typeof currentRouteInfo.routeDirection === 'string' ) ? currentRouteInfo.routeDirection : '';

                        sortedPredictions.alsoAtStop.push( o );
                    }

                    if ( showDisclaimer ) {
                        if ( Array.isArray( sortedPredictions.predictions ) ) {
                            sortedPredictions.showFooterDisclaimer = true;
                        }
                    }

                }

            } );

            return sortedPredictions;
        }
    };
} );
