/**
 * Stops by direction model.
 */
define( [
    "jquery",
    "underscore",
    "backbone"
], function ( $, _, backbone ) {

    "use strict";

    var stopsByDirection = Backbone.Model.extend( {
        urlRoot: "../../../app/"
    } );

    return stopsByDirection;
} );
