//show route stops controller
var app = app || {};

( function () {
    'use strict';

    app.controller.showBusRouteStops = function ( routeId, stopId ) {

        //Close both the direction view and bus countdown view if they are open.

        if ( typeof app.activeViews.busCountdown === 'object' && typeof app.activeViews.busCountdown.close === 'function' ) {
            app.activeViews.busCountdown.close();
            app.activeViews.busCountdown = {};
            delete app.activeViews.busCountdown;

        }

        if ( ( typeof app.activeViews.busRouteStops !== 'object' ) || ( app.defaults.routeNumber !== routeId ) || ( routeId ) || ( routeId && stopId ) ) {
            app.defaults.routeNumber = ( !isNaN( routeId ) ) ? routeId : app.defaults.routeNumber;
            app.defaults.stopId = ( !isNaN( stopId ) ) ? stopId : app.defaults.stopId;
            app.activeViews.busRouteStops = new app.views.busRouteStops( {
                model: app.collections.busRouteStops
            } );
        }
    };
} )();
