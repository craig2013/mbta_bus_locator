/**
 * Stops by route collection.
 */
define( [
    "jquery",
    "underscore",
    "backbone",
    "models/stops/stopsByRoute"
], function ( $, backbone, _, stopsByRouteModel ) {

    "use strict";

    var stopsBuyRoute = Backbone.Collection.extend( {
        model: stopsByRouteModel,
        url: "/app/"
    } );

    return new stopsBuyRoute;
} );
