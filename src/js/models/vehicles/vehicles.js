//Vehicles model
define( [
    "jquery",
    "underscore",
    "backbone"
], function ( $, _, Backbone ) {

    "use strict";

    var vehicles = Backbone.Model.extend( {
        urlRoot: "/app/"
    } );

    return vehicles;
} );
