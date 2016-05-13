//Vehicles model
define( [
   "jquery",
    "underscore",
    "backbone"
], function ( $, _, backbone ) {

    "use strict";

    var vehicles = Backbone.Model.extend( {
        urlRoot: "../../../app/"
    } );

    return vehicles;
} );