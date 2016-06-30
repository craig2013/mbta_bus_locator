//Direction collection
define( [
    "jquery",
    "underscore",
    "backbone",
    "models/direction/direction"
], function ( $, _, backbone, directionModel ) {

    "use strict";

    var direction = Backbone.Collection.extend( {
        model: directionModel,
        url: "../../../app/"
    } );

    return new direction();
} );
