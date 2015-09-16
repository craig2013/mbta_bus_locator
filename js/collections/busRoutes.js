//routes collection
var app = app || {};

( function () {
    'use strict';

    app.collections.busRoutes = Backbone.Collection.extend( {
        model: app.models.busRoutes,
        url: '../../app/'
    } );

    app.collections.busRoutes = new app.collections.busRoutes();
} )();
