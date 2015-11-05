//bus stop directions model
define( [
    'jquery',
    'underscore',
    'backbone'
], function ( $, _, backbone ) {

    'use strict';

    var busDirectionModel = Backbone.Model.extend( {
        urlRoot: '../../app/'
    } );

    return busDirectionModel;
} );
