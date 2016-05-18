//Predictions model
define( [
    "jquery",
    "underscore",
    "backbone"
], function ( $, _, backbone ) {

    "use strict";

    var predictions = Backbone.Model.extend( {
        urlRoot: "../../../app/"
    } );

    return predictions;
} );
