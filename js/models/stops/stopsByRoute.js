/**
 * Stops by route model.
 */
define( [
    "jquery",
    "underscore",
    "backbone"
], function ( $, _, backbone ) {

    "use strict";

    var stopsByRoute = Backbone.Model.extend( {
        urlRoot: "../../../app/"
    } );

    return stopsByRoute;
} );
