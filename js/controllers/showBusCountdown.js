//show bus countdown time controller
var app = app || {};

( function () {
    'use strict';

    app.controller.showBusCountdown = function () {
        app.activeViews.busCountdown = new app.views.busCountdown( {
            model: app.collections.busCountdown
        } );
    }
} )();
