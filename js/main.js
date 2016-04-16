require.config( {
    'baseUrl': '/js',
    'paths': {
        'jquery': [
            'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery',
            'libs/jquery/jquery'
        ],
        'underscore': [
            'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore',
            'libs/underscore/underscore'
        ],
        'backbone': [
            'https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.2.1/backbone',
            'libs/backbone/backbone'
        ],
        'chosen': [
            'https://cdnjs.cloudflare.com/ajax/libs/chosen/1.4.2/chosen.jquery',
            'libs/jquery/plugins/chosen/chosen'
        ],
        'templates': '../templates'
    },
    'shim': {
        jquery: {
            exports: '$'
        },
        chosen: {
            deps: [ 'jquery' ]
        },
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [ 'jquery', 'underscore' ],
            exports: 'Backbone'
        }
    },
    urlArgs: 'bust=' + Date.now()
} );

require( [
        'underscore',
        'backbone',
        'app'
    ],
    function ( _, Backbone, app ) {

        /** Global variables and functions**/
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
                    'longName': 'Silver Line SL2, Drydock',
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

        app.initialize();
    } );
