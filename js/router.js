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
    'views/busCountdown'
], function ( $, _, Backbone,
    busRoutesModel, busDirectionsModel, busRouteStopsModel, busCountdownModel,
    busRoutesCollection, busDirectionsCollection, busStopsCollection, busCountdownCollection,
    busRoutesView, busDirectionsView, busRouteStopsView, busCountdownView ) {

    'use strict';

    Backbone.View.prototype.close = function () {
        if ( this.onClose ) {
            this.onClose();
        }
        this.remove();
    };

    /** Global variables are inside this object**/
    Backbone.app = {};
    Backbone.app.defaults = {
        'refreshPredictionsTime': 20000,
        'agencyTag': 'mbta',
        'routeNumber': 0,
        'directionVar': '',
        'stopId': 0,
        'stopTag': '',
        'routeNames': {
            '741': {
                'longName': 'Silver Line SL1',
                'shortName': 'SL1'
            },
            '742': {
                'longName': 'Silver Line SL2',
                'shortName': 'SL2'
            },
            '751': {
                'longName': 'Silver Line SL4',
                'shortName': 'SL4'
            },
            '746': {
                'longName': 'Silver Line, Drydock',
                'shortName': 'SL2'
            },
            '749': {
                'longName': 'Silver Line, Waterfront',
                'shortName': 'SL1'
            },
            '701': {
                'longName': 'CT1',
                'shortName': 'CT1'
            },
            '747': {
                'longName': 'CT2',
                'shortName': 'CT2'
            },
            '708': {
                'longName': 'CT3',
                'shortName': 'CT3'
            }

        }
    };

    Backbone.app.settings = {
        'busCountdownTimer': 0
    };

    var router = Backbone.Router.extend( {
        routes: {
            '': 'homeRoute',
            'route/:routeId(/)': 'routeSelected',
            'route/:routeId/direction/:busDirection(/)': 'directionSelected',
            'route/:routeId/direction/:busDirection/stop/:stopId': 'stopSelected'
        }
    } );

    var initialize = function () {
        var busRouter = new router;

        Backbone.app.router = busRouter;

        //homeRoute: No route selected.sole
        busRouter.on( 'route:homeRoute', function () {
            if ( this.directionView ) {
                this.directionView.close();
                delete this.directionView;
            }
            if ( this.stopsView ) {
                this.stopsView.close();
                delete this.stopsView;
            }
            if ( this.countDownView ) {
                this.countDownView.close();
                delete this.countDownView;
            }
            this.routeView = new busRoutesView( {
                model: busRoutesCollection
            } );
            this.routeView.render();
        } );

        //routeSelected: Route selected, but no direction selected yet.
        busRouter.on( 'route:routeSelected', function ( routeId ) {
            if ( this.stopsView ) {
                this.stopsView.close();
                delete this.stopsView;
            }
            if ( this.countDownView ) {
                this.countDownView.close();
                delete this.countDownView;
            }
            if ( !isNaN( routeId ) && ( !this.routeView ) ) {
                Backbone.app.defaults.routeNumber = routeId;
                this.routeView = new busRoutesView( {
                    model: busRoutesCollection
                } );
                this.routeView.render();
            }
            if ( this.directionView ) {
                this.directionView.close();
                delete this.directionView;
            }
            this.directionView = new busDirectionsView( {
                model: busDirectionsCollection
            } );
            this.directionView.render();
        } );

        //directionSelected: Direction selected but no stop selected yet.
        busRouter.on( 'route:directionSelected', function ( routeId, busDirection ) {
            if ( this.countDownView ) {
                this.countDownView.close();
                delete this.countDownView;
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
            if ( this.stopsView ) {
                this.stopsView.close();
                delete this.stopsView;
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
            this.countDownView = new busCountdownView( {
                model: busCountdownCollection
            } );
            this.countDownView.render();
        } );

        Backbone.history.start();
    };

    return {
        initialize: initialize
    };
} );
