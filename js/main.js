require.config( {
    baseUrl: "/js",
    paths: {
        async: "libs/require-js/plugins/async/async",
        markerlabel: "libs/google-maps/markerwithlabel-amd",
        jquery: [
            "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery",
            "libs/jquery/jquery"
        ],
        Q: [
            "https://cdnjs.cloudflare.com/ajax/libs/q.js/1.4.1/q",
            "libs/q/q"
        ],
        underscore: [
            "https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore",
            "libs/underscore/underscore"
        ],
        backbone: [
            "https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.2.1/backbone",
            "libs/backbone/backbone"
        ],
        chosen: [
            "https://cdnjs.cloudflare.com/ajax/libs/chosen/1.4.2/chosen.jquery",
            "libs/jquery/plugins/chosen/chosen"
        ],
        templates: "templates"
    },
    shim: {
        jquery: {
            exports: "$"
        },
        Q: {
            exports: "Q"
        },
        chosen: {
            deps: [ "jquery" ]
        },
        underscore: {
            exports: "_"
        },
        backbone: {
            deps: [ "jquery", "underscore" ],
            exports: "Backbone"
        }
    },
    urlArgs: 'bust=' + Date.now()
} );

require( [
        "underscore",
        "backbone",
        "app"
    ],
    function ( _, Backbone, app ) {

        "use strict";

        /** Global variables and functions**/
        Backbone.app = {};
        Backbone.app.defaults = {
            mode: null,
            route: null,
            direction: null,
            map: null,
            mapLoaded: false,
            predictionOptions: {},
            showMap: false,
            stop: null,
            stopValidated: false,
            timers: [],
            vehicles: []
        };

        app.initialize();
    } );
