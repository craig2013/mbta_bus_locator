//router
define( [
    'jquery',
    'underscore',
    'backbone',
    'models/busRoutes',
    'models/busRouteDirections',
    'models/busRouteStops',
    'models/busCountdown',
    'collections/busRoutes',
    'collections/busRouteDirections',
    'collections/busRouteStops',
    'collections/busCountdown',
    'views/busRoutes',
    'views/busRouteDirections',
    'views/busRouteStops',
    'views/selectedRoute',
    'views/alsoAtStop'
], function ( $, _, Backbone,
    busRoutesModel, busDirectionsModel, busRouteStopsModel, busCountdownModel,
    busRoutesCollection, busDirectionsCollection, busStopsCollection, busCountdownCollection,
    busRoutesView, busDirectionsView, busRouteStopsView, selectedRouteView, alsoAtStopView ) {

    'use strict';

    var router = Backbone.Router.extend( {
        routes: {
            '': 'homeRoute',
            'route/:routeId(/)': 'routeSelected',
            'route/:routeId/direction/:busDirection(/)': 'directionSelected',
            'route/:routeId/direction/:busDirection/stop/:stopId': 'stopSelected'
        }
    } );

    var initialize = function () {
        var busRouter = new router();

        Backbone.app.router = busRouter;

        //homeRoute: No route selected.
        busRouter.on( 'route:homeRoute', function () {
            this.routeView = new busRoutesView( {
                model: busRoutesCollection
            } );
            this.routeView.render();
        } );

        //routeSelected: Route selected, but no direction selected yet.
        busRouter.on( 'route:routeSelected', function ( routeId ) {
            if ( this.directionView ) {
                this.directionView.close();
                delete this.directionView;
            }
            if ( this.stopsView ) {
                this.stopsView.close();
                delete this.stopsView;
            }
            if ( this.selectedRouteView ) {
                this.selectedRouteView.close();
                delete this.selectedRouteView;
            }
            if ( !isNaN( routeId ) && ( !this.routeView ) ) {
                Backbone.app.defaults.routeNumber = routeId;
                this.routeView = new busRoutesView( {
                    model: busRoutesCollection
                } );
                this.routeView.render();
            }
            this.directionView = new busDirectionsView( {
                model: busDirectionsCollection
            } );
            this.directionView.render();
        } );

        //directionSelected: Direction selected but no stop selected yet.
        busRouter.on( 'route:directionSelected', function ( routeId, busDirection ) {
            if ( this.stopsView ) {
                this.stopsView.close();
                delete this.stopsView;
            }
            if ( this.selectedRouteView ) {
                this.selectedRouteView.close();
                delete this.selectedRouteView;
            }
            if ( !isNaN( routeId ) && ( !this.routeView ) ) {
                Backbone.app.defaults.routeNumber = routeId;
                this.routeView = new busRoutesView( {
                    model: busRoutesCollection
                } );
                this.routeView.render();
            }
            if ( ( busDirection.length >= 1 ) && ( !this.directionView ) ) {
                Backbone.app.defaults.directionVar = busDirection;
                this.directionView = new busDirectionsView( {
                    model: busDirectionsCollection
                } );
                this.directionView.render();
            }
            this.stopsView = new busRouteStopsView( {
                model: busStopsCollection
            } );
            this.stopsView.render();
        } );

        //stopSelected: Everything has been set so show bus prediction time(s).
        busRouter.on( 'route:stopSelected', function ( routeId, busDirection, stopId ) {
            if ( ( !isNaN( routeId ) ) && ( !this.routeView ) ) {
                Backbone.app.defaults.routeNumber = routeId;
                this.routeView = new busRoutesView( {
                    model: busRoutesCollection
                } );
                this.routeView.render();
            }
            if ( ( busDirection.length >= 1 ) && ( !this.directionView ) ) {
                Backbone.app.defaults.directionVar = busDirection;
                this.directionView = new busDirectionsView( {
                    model: busDirectionsCollection
                } );
                this.directionView.render();
            }
            if ( ( !isNaN( stopId ) ) && ( !this.stopsView ) ) {
                Backbone.app.defaults.stopId = stopId;
                this.stopsView = new busRouteStopsView( {
                    model: busStopsCollection
                } );
                this.stopsView.render();
            }
            if ( this.selectedRouteView ) {
                this.selectedRouteView.close();
                delete this.selectedRouteView;
            }
            this.selectedRouteView = new selectedRouteView( {
                model: busCountdownCollection,
                el: '.selected-route-container'
            } );
            this.selectedRouteView.render();
        } );

        Backbone.history.start();
    };

    return {
        initialize: initialize
    };
} );
