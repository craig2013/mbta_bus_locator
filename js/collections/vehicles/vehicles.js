//Vehicles collection
define( [
    "jquery",
    "underscore",
    "backbone",
    "models/vehicles/vehicles"
], function ( $, backbone, _, vehiclesModel ) {

    "use strict";

    var vehicles = Backbone.Collection.extend( {
        model: vehiclesModel,
        url: "../../../app/"
    } );

    return new vehicles();
} );
