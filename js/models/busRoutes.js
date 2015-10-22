//routes model
define([
                'jquery',
                'underscore',
                'backbone'], function($, _, backbone) {

            'use strict';

            var busRoutesModel = Backbone.Model.extend({
            	urlRoot: '../../app/'
            });

            return busRoutesModel;
});

