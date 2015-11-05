/**
 * Function that returns a route name for a selected route.
 *
 * @param {String} The route number.
 *
 * @return {String} The route name.
 **/
define( [
    'jquery',
    'underscore',
    'backbone'
], function ( $, _, Backbone ) {

    'use strict';

    return {
        getRouteName: function ( routeNumber, routeType ) {
            var routeName = '';

            if ( !isNaN( routeNumber ) ) {
                if ( routeNumber === '741' ) {
                    routeName = Backbone.app.defaults.routeNames[ 741 ][ routeType ];
                } else if ( routeNumber === '742' ) {
                    routeName = Backbone.app.defaults.routeNames[ 742 ][ routeType ];
                } else if ( routeNumber === '746' ) {
                    routeName = Backbone.app.defaults.routeNames[ 746 ][ routeType ];
                } else if ( routeNumber === '749' ) {
                    routeName = Backbone.app.defaults.routeNames[ 749 ][ routeType ];
                } else if ( routeNumber === '751' ) {
                    routeName = Backbone.app.defaults.routeNames[ 751 ][ routeType ];
                } else {
                    routeName = undefined;
                }
            }

            return routeName;
        }
    };

} );
