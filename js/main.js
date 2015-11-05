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
        backbone: {
            deps: [ 'jquery', 'underscore' ],
            exports: 'Backbone'
        },
        underscore: {
            exports: '_'
        }
    }
} );

require( [
        'underscore',
        'backbone',
        'app'
    ],
    function ( _, Backbone, app ) {
        app.initialize();
    } );
