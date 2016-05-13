//Stops model
define( [
   "jquery",
    "underscore",
    "backbone"
], function ( $, _, backbone ) {

    "use strict";

    var stops = Backbone.Model.extend( {
        urlRoot: "../../../app/"
    } );

    return stops;
} );