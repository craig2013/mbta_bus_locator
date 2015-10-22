//route stops model
define([
                'jquery',
                'underscore',
                'backbone'], function($, _, backbone) {

            'use strict';

            var busRouteStopsModel = Backbone.Model.extend({
            	urlRoot: '../../app/'
            });

            return busRouteStopsModel;
});


