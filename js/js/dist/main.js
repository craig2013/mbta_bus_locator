require.config( {
    baseUrl: "/js",
    paths: {
        async: "libs/require-js/plugins/async/async",
        markerlabel: "libs/google-maps/markerwithlabel-amd",
        jquery: [
            "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery",
            "libs/jquery/jquery"
        ],
        underscore: [
            "https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore",
            "libs/underscore/underscore"
        ],
        backbone: [
            "https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.2.1/backbone",
            "libs/backbone/backbone"
        ],
        backboneRouterFiler: [
            "https://cdnjs.cloudflare.com/ajax/libs/backbone.routefilter/0.2.0/backbone.routefilter.js",
            "libs/backbone/plugins/backbone.routefilter.js"
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
        chosen: {
            deps: [ "jquery" ]
        },
        underscore: {
            exports: "_"
        },
        backbone: {
            deps: [ "jquery", "underscore" ],
            exports: "Backbone"
        },
        backboneRouterFiler: {
            deps: ["backbone"],
            exports: "backboneRouterFiler"
        }
    },
    urlArgs: "bust=" + Date.now()
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
            stop: null,
            mapLoaded: false,
            vehicles: []
        };

        Backbone.app.defaultSettings  = {
            mapTimer: null,
            predictionsTimer: null,
            refreshPredictionsTime: 20000
        };

        app.initialize();
} );