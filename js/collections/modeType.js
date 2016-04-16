//routes model
define( [
    'jquery',
    'underscore',
    'backbone'
], function ( $, _, backbone ) {

    'use strict';

    var modeType = Backbone.Model.extend( {
        urlRoot: '../../app/?queryType=routes'
    } );

    return modeType;
} );
