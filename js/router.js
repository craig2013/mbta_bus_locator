//router
var app = app || {};

(function() {
    'use strict';
    
    var router = Backbone.Router.extend({
          routes: {
                '': 'homeRoute',
                'route/:routeId': 'routeSelected',
                'route/:routeId/direction/:busDirection': 'directionSelected',
                'route/:routeId/direction/:busDirection/stop/:stopId': 'stopSelected'
            }
    });           


    app.router = new router;

    //homeRoute: No route selected.sole
    app.router.on('route:homeRoute', function() { 
            app.controller.showBusRoutes();
    });

    //routeSelected: Route selected, but no direction selected yet.
    app.router.on('route:routeSelected', function(routeId) {
            if ( !app.activeViews.busRoutes ) {
                app.controller.showBusRoutes(routeId);
            }
            app.controller.showBusRouteDirections(0);
    });

    //directionSelected: Direction selected but no stop selected yet.
    app.router.on('route:directionSelected', function(routeId, busDirection) {
            if ( !app.activeViews.busRoutes && !app.activeViews.busRouteDirections ) {
                app.controller.showBusRoutes(routeId);
                app.controller.showBusRouteDirections(busDirection);
            }
            app.controller.showBusRouteStops(routeId, 0);
    });    

    //stopSelected: Everything has been set so show bus prediction time(s).
    app.router.on('route:stopSelected', function(routeId, busDirection, stopId) {
            if ( !app.activeViews.busRoutes && !app.activeViews.busRouteDirections ) {
                app.controller.showBusRoutes(routeId);
                app.controller.showBusRouteDirections(busDirection);
                app.controller.showBusRouteStops(routeId, stopId);
            }        
       app.controller.showBusCountdown();
    });
   

    Backbone.history.start();
})();