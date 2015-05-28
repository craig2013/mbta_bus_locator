var app = app || {};

(function() {
	'use strict';
	
	app.views.busRoutes = Backbone.View.extend({

		el: '.routesAvailable',
		template: _.template($('#tpl-routes').html()),
		tagName: 'option',

		initialize: function() {
			app.collections.busRoutes.fetch({
				traditional: true,
				data: {
					'command': 'routeList', 
					'agency': app.defaults.agencyTag
				}
			});
			this.listenTo(app.collections.busRoutes, 'reset', this.render);
			this.listenTo(app.collections.busRoutes, 'add', this.render);
		},

		render: function(e) {
			var self = this;
			this.$route_select = $('#route_select');
			if (_.isObject(this.model.models[0])) {
				if (this.$route_select.find('option').length<=1) {
					_.each(this.model.models[0].attributes.route, function(busRoute) {
						self.$route_select.append(self.template(busRoute.attributes));
					});			
				}	
				$('.container main .loading').hide();

				if ( !isNaN(app.defaults.routeNumber) ) {	
					this.$route_select.val(app.defaults.routeNumber);
				}	


				$('.container main .content, .container main .content .routeInfo .routesAvailable').show();
			}
		},

		events: {
			'click #getRouteDirections': 'showDirections'
		},

		showDirections: function(e) {
			var routeNumber = this.$route_select.val();
			if ( !isNaN(routeNumber) ) {
				app.defaults.routeNumber  = routeNumber;
				app.router.navigate('route/' + app.defaults.routeNumber, {trigger: true});     
			}
			return false; 
		},

		close: function() {
		            $(this.el).unbind();
		            $(this.el).empty();			
		}
	});
})();