//Router utility functions.
define([
    "jquery",
    "underscore",
    "backbone",
], function($, _, Backbone) {

	"use strict";

	return {
	        /**
	        * This function is used to close open views.
	        *
	        * @param closeViews {Array} A list of views to close if open.
	        *
	        **/
	        closeViews: function(closeViews) {
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
	        /**
	         * This functon will open views passed into it from the router if a view is bookmarked and a user arives via the bookmark.
	         * 
	         * @param  {Array} (openViews) An array of objects that lists the property of the view, property name, router method to be called, and the view.
	         * 
	         */
	        openViews: function(openViews) {
	        	for ( var i = 0; i < arguments.length; i++ ) {
	        		var property = arguments[i].property;
	        		var propertyName = arguments[i].propertyName;
	       		var routeMethodName = arguments[i].routeMethodName;
	       		var view = arguments[i].view;
	       		if ( (typeof property !== "undefined") && (!this[view]) ) {
	       			Backbone.app.defaults[propertyName] = property;
	       			if ( typeof this[routeMethodName] === "function" ) {
	       				this[routeMethodName]();
	       			}
	       		}
	        	}
	        }
	}
});