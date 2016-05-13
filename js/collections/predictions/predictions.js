//Predictions collection
define( [
    "jquery",
    "underscore",
    "backbone",
    "models/predictions/predictions"
], function ( $, backbone, _, predictionModel ) {

    "use strict";

    var predictions = Backbone.Collection.extend( {
        model: predictionModel,
        url: "../../../app/"
    } );

    return new predictions();
} );