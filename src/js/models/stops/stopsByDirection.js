/**
 * Stops by direction model.
 */
define( [
    "jquery",
    "underscore",
    "backbone"
], function ( $, _, Backbone ) {

    "use strict";

    var stopsByDirection = Backbone.Model.extend( {
        urlRoot: "/app/"
    } );

    return stopsByDirection;
} );
