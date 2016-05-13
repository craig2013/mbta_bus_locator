//Routes collection
define( [
    "jquery",
    "underscore",
    "backbone",
    "models/routes/routes"
], function ( $, backbone, _, routesModel ) {

    "use strict";

    var routes = Backbone.Collection.extend( {
        model: routesModel,
        url: "../../../app/"
    } );

    return new routes();
} );