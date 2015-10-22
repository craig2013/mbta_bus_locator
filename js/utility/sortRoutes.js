/**
 * Function that returns the predictions sorted for either the route selected or bus routes that also stop at the bus stop.
 *
 * @param obj This is the predictions object.
 *
 * @return The bus predictions containing an array of objects called predictions, an  array of obects called alsoAtStop, and showFooterDisclaimer.
 **/
define([
    'jquery',
    'underscore',
    'backbone'], function($, _, Backbone) {

    'use strict';

    return {
        sortRoutes: function( obj ) {
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

                        if ( routeNumber === '741' ) {
                            routeName = Backbone.app.defaults.routeNames[ '741' ].longName;
                        } else if ( routeNumber === '742' ) {
                            routeName = Backbone.app.defaults.routeNames[ '742' ].longName;
                        } else if ( routeNumber === '746' ) {
                            routeName = Backbone.app.defaults.routeNames[ '746' ].longName;
                        } else if ( routeNumber === '749' ) {
                            routeName = Backbone.app.defaults.routeNames[ '749' ].longName;
                        } else if ( routeNumber === '751' ) {
                            routeName = Backbone.app.defaults.routeNames[ '751' ].longName;
                        } else {
                            routeName = ( typeof o.attributes.dirTag === 'string' ) ? o.attributes.dirTag.substring( 0, 3 ).replace( '_', ' ' ) : '';
                        }

                        o.attributes[ 'routeName' ] = routeName;

                        if ( routeName )
                            sortedPredictions.alsoAtStop.push( o );
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

                        if ( routeNumber === '741' ) {
                            routeName = Backbone.app.defaults.routeNames[ '741' ].longName;
                        } else if ( routeNumber === '742' ) {
                            routeName = Backbone.app.defaults.routeNames[ '742' ].longName;
                        } else if ( routeNumber === '746' ) {
                            routeName = Backbone.app.defaults.routeNames[ '746' ].longName;
                        } else if ( routeNumber === '749' ) {
                            routeName = Backbone.app.defaults.routeNames[ '749' ].longName;
                        } else if ( routeNumber === '751' ) {
                            routeName = Backbone.app.defaults.routeNames[ '751' ].longName;
                        } else {
                            routeName = ( typeof o.attributes.dirTag === 'string' ) ? o.attributes.dirTag.substring( 0, 3 ).replace( '_', ' ' ) : '';
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
});