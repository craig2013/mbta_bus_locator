//Stops collection
define( [
    "jquery",
    "underscore",
    "backbone",
    "models/stops/stops"
], function ( $, backbone, _, stopsModel ) {

    "use strict";

    var stops = Backbone.Collection.extend( {
        model: stopsModel,
        url: "/app/"
    } );

    return new stops();
} );
