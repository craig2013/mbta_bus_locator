//show routes controller
var app = app || {};

(function() {
	'use strict';
	
	app.controller.showBusRoutes = function(routeId) {	
		//Close all other active views if they are open.
		if ( (typeof app.activeViews.busRouteDirections === 'object') && (typeof app.activeViews.busRouteDirections === 'function') ) {
		    	app.activeViews.busRouteDirections.close();
		    	app.activeViews.busRouteDirections = {};
		    	delete app.activeViews.busRouteDirections;		
		}

		if ( (typeof app.activeViews.busRouteStops  === 'object') && (typeof app.activeViews.busRouteStops.close === 'function') )  {
		   	app.activeViews.busRouteStops.close();
		    	app.activeViews.busRouteStops = {};
		    	delete app.activeViews.busRouteStops;
		} 

		if ( (typeof app.activeViews.busCountdown === 'object') && (typeof app.activeViews.busCountdown.close === 'function') ) {
			app.activeViews.busCountdown.close();
			app.activeViews.busCountdown = {};
			delete app.activeViews.busCountdown;
		}

		if ( !isNaN(routeId) ) {
			app.defaults.routeNumber  = routeId;
		}
	
		//Execute main view once when page is loaded
		app.activeViews.busRoutes = new app.views.busRoutes({model: app.collections.busRoutes});
	};
})();