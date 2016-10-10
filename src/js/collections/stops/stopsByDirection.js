/**
 * Stops by route collection.
 */
define( [
    "jquery",
    "underscore",
    "backbone",
    "models/stops/stopsByDirection"
], function ( $, backbone, _, stopsByDirectionModel ) {

    "use strict";

    var stopsByDirection = Backbone.Collection.extend( {
        model: stopsByDirectionModel,
        url: "/app/"
    } );

    return new stopsByDirection;
} );
