//Stops model
define( [
    "jquery",
    "underscore",
    "backbone"
], function ( $, _, Backbone ) {

    "use strict";

    var stops = Backbone.Model.extend( {
        urlRoot: "/app/"
    } );

    return stops;
} );
