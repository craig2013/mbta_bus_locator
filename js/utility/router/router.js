//Router utility functions.
define([
    "jquery",
    "underscore",
    "backbone",
    "utility/router/router",
    "models/routes/routes",
    "models/stops/stops",
    "models/predictions/predictions",
    "models/vehicles/vehicles",
    "collections/routes/routes",
    "collections/stops/stops",
    "collections/predictions/predictions",
    "collections/vehicles/vehicles",
    "views/mode/mode",
    "views/routes/route",
    "views/direction/direction",
    "views/stops/stops",
    "views/predictions/predictions",
    "views/map/map"
], function($, _, Backbone, utility, 
	routesModel, stopsModel, predictionsModel, vehiclesModel,
	routesCollection, stopsCollection, predictionsCollection, vehiclesCollection,
	modeView, routesView, directionsView, stopsView, predictionsView, mapsView) {

	"use strict";

	return {
	        /**
	        * This function is used to close open views.
	        *
	        * @param closeViews {Array} A list of views to close if open.
	        *
	        * @return The views that are suposed to remain open.
	        **/
	        closeOpenViews: function(closeViews) {
	            for ( var i = 0; i < arguments.length; i++ ) {
	                var viewToClose = arguments[i];
	                if ( this.hasOwnProperty(viewToClose) ) {
	                    if ( (typeof this[viewToClose ]=== "object")  && (typeof this[viewToClose].close === "function") ) {
	                        this[viewToClose].close();
	                        delete this[viewToClose];
	                    }
	                }
	            }
	            
	        },	
	        /*
	         * 
	         * TODO: rewrite this part using deferreds and/or promises.
	         * 
	         */
	        openViews: function(openViews) {
	        	
	       }
	}
});