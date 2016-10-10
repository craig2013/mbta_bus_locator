//Direction model
define( [
    "jquery",
    "underscore",
    "backbone"
], function ( $, _, Backbone ) {

    "use strict";

    var direction = Backbone.Model.extend( {
        urlRoot: "/app/"
    } );

    return direction;
} );
