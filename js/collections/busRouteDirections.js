//routes collection
define( [
    'jquery',
    'underscore',
    'backbone',
    'models/busRouteDirections'
], function ( $, backbone, _, busRouteDirectionsModel ) {

    'use strict';

    var busRouteDirections = Backbone.Collection.extend( {
        model: busRouteDirectionsModel,
        url: '../../app/'
    } );

    return new busRouteDirections();
} );
