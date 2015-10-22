//bus route stops collection
define([
                'jquery',
                'underscore',
                'backbone',
                'models/busRouteStops'], function($, backbone, _, busRouteStopsModel) {

            'use strict';

            var busRoutes = Backbone.Collection.extend( {
		model: busRouteStopsModel,
		url: '../../app/'
            });

            return new busRoutes();
});