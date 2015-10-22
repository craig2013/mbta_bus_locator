//bus countdown model
define([
                'jquery',
                'underscore',
                'backbone'], function($, _, backbone) {

            'use strict';

            var busCountdownModel = Backbone.Model.extend({
            	urlRoot: '../../app/'
            });

            return busCountdownModel;
});
