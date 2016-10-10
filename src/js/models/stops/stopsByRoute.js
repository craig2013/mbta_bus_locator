/**
 * Stops by route model.
 */
define( [
    "jquery",
    "underscore",
    "backbone"
], function ( $, _, Backbone ) {

    "use strict";

    var stopsByRoute = Backbone.Model.extend( {
        urlRoot: "/app/"
    } );

    return stopsByRoute;
} );
