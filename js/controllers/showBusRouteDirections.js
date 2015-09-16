//show bus stop directions controller
var app = app || {};

( function () {
    'use strict';

    app.controller.showBusRouteDirections = function ( busStopDirection ) {
        //Close all active views
        if ( ( typeof app.activeViews.busRouteStops === 'object' ) && ( typeof app.activeViews.busRouteStops.close === 'function' ) ) {
            app.activeViews.busRouteStops.close();
            app.activeViews.busRouteStops = {};
            delete app.activeViews.busRouteStops;
        }

        if ( ( typeof app.activeViews.busCountdown === 'object' ) && ( typeof app.activeViews.busCountdown.close === 'function' ) ) {
            app.activeViews.busCountdown.close();
            app.activeViews.busCountdown = {};
            delete app.activeViews.busCountdown;
        }

        if ( busStopDirection === 0 ) {
            app.defaults.directionText = 0;
            app.defaults.directionVar = 0;
        } else {
            app.defaults.directionVar = busStopDirection;
        }

        app.activeViews.busRouteDirections = new app.views.busRouteDirections( {
            model: app.collections.busRouteDirections
        } );
    };
} )();
