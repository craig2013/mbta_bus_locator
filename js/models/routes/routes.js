//Routes model
define( [
    "jquery",
    "underscore",
    "backbone"
], function ( $, _, backbone ) {

    "use strict";

    var routes = Backbone.Model.extend( {
        urlRoot: "../../../app/routes/"
    } );

    return routes;
} );
