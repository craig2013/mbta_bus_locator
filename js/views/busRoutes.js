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
			var routeModel = this.model.models[0];
			var self = this;
			this.$route_select = $('#route_select');

			if ( typeof routeModel === 'object' ) {
				if ( this.$route_select.find('option').length<=1 ) {
					for ( var i = 0; i < routeModel.attributes.route.length; i++ ) {
						self.$route_select.append(self.template(routeModel.attributes.route[i].attributes));
					}			
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
		            this.$el.unbind();		
		}
	});
})();