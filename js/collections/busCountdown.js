//bus countdown collection
var app = app || {};

(function() {
	'use strict';	
	
	app.collections.busCountdown = Backbone.Collection.extend({
		model: app.models.busCountdown,
		url:  '../../app/'
	});

	app.collections.busCountdown = new app.collections.busCountdown();
})();