//bus route stops collection
var app = app || {};

( function () {
    'use strict';

    app.collections.busRouteStops = Backbone.Collection.extend( {
        model: app.models.busRouteStops,
        url: '../../app/'
    } );

    app.collections.busRouteStops = new app.collections.busRouteStops();
} )();
