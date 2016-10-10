//Predictions model
define( [
    "jquery",
    "underscore",
    "backbone"
], function ( $, _, Backbone ) {

    "use strict";

    var predictions = Backbone.Model.extend( {
        urlRoot: "/app/"
    } );

    return predictions;
} );
