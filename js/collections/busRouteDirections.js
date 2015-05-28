//bus stop directions collection
var app = app || {};

(function() {
	'use strict';
	
	app.collections.busRouteDirections = Backbone.Collection.extend({
		model: app.models.busRouteDirections,
		url:  '../../app/'
	});

	app.collections.busRouteDirections = new app.collections.busRouteDirections();
})();