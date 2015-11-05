//countdown collection
define( [
    'jquery',
    'underscore',
    'backbone',
    'models/busCountdown'
], function ( $, backbone, _, busCountdownModel ) {

    'use strict';

    var busRouteDirections = Backbone.Collection.extend( {
        model: busCountdownModel,
        url: '../../app/'
    } );

    return new busRouteDirections();
} );
