//routes collection
define([
                'jquery',
                'underscore',
                'backbone',
                'models/busRoutes'], function($, backbone, _, busRouteModel) {

            'use strict';

            var busRoutes = Backbone.Collection.extend( {
		model: busRouteModel,
		url: '../../app/'
            });

            return new busRoutes();
});
