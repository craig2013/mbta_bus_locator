var app = app || {};

( function () {
    'use strict';

    //Global app skeleton
    app = {
        'activeViews': {},
        'collections': {},
        'controller': {},
        'defaults': {},
        'functions': {},
        'models': {},
        'routes': {},
        'settings': {},
        'views': {}
    };

    //App default parameters
    app.defaults = {
        'agencyTag': 'mbta',
        'routeNumber': 0,
        'stopId': 0,
        'stopTag': 0,
        'directionText': 0,
        'directionVar': 0,
        'refreshPredictionsTime': 20000,
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

    /**
     * Function that checks weather or not nested properties exist within an object.
     *
     * @param obj This is the object you are testing.
     * @param The second is a list of strings indicated by 'str1','str2', 'str3'... that is the properties your testing for.
     *
     * @return This returns true if the nested objects exist or false if they don't.
     */
    app.functions.checkNested = function ( obj ) {
        var args = Array.prototype.slice.call( arguments, 1 );

        for ( var i = 0; i < args.length; i++ ) {
            if ( !obj || !obj.hasOwnProperty( args[ i ] ) ) {
                return false;
            }
            obj = obj[ args[ i ] ];
        }
        return true;
    }


    /**
     * Function is pollyfil for isArray for testing if a object is an array.
     *
     *
     * @return true if object is an array or false if it isn't.
     */
    if ( !Array.isArray ) {
        Array.isArray = function ( arg ) {
            return Object.prototype.toString.call( arg ) === '[object Array]';
        };
    }

} )();
