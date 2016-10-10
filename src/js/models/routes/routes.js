//Routes model
define( [
    "jquery",
    "underscore",
    "backbone"
], function ( $, _, Backbone ) {

    "use strict";

    var routes = Backbone.Model.extend( {
        urlRoot: "/app/routes/"
    } );

    return routes;
} );
