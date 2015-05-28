var app = app || {};

(function() {
	'use strict';
	
	app.views.busRouteStops = Backbone.View.extend({

		el: '.routeStops',
		template: _.template($('#tpl-route-stops').html()),
		tagName: 'option',

		initialize: function() {
			app.collections.busRouteStops.fetch({
				traditional: true,
				data: {
					'command': 'directionStops', 
					'agency': app.defaults.agencyTag,
					'route': app.defaults.routeNumber,
					'direction': app.defaults.directionVar
				}
			});
			this.listenTo(app.collections.busRouteStops, 'add', this.render);
		},

		render: function() {
			var self = this;
			var busRouteStopModel = this.model;
			var busRouteStops = this.getBusRouteStops(busRouteStopModel);

			this.$stop_select = $('#stop_select');		

			if ( _.isArray(busRouteStops.stops) ) {
				this.$stop_select.find('option:gt(0)').remove();

				busRouteStops = _.sortBy(busRouteStops.stops, 'title');

				_.each(busRouteStops, function(obj) {
					if ( typeof obj === 'object' ) {
						var busStopItems = {
							'stopId': '',
							'dirTag': '',
							'title': '' 
						};
						if ( typeof obj.attributes.tag === 'string' && typeof obj.attributes.stopId === 'string' && typeof obj.attributes.title === 'string' ) {
							busStopItems.dirTag = obj.attributes.tag;
							busStopItems.stopId = obj.attributes.stopId;
							busStopItems.title = obj.attributes.title;

							self.$stop_select.append(self.template(busStopItems));
						}
					}
				});


				if ( !isNaN(app.defaults.stopId) ) {
					this.$stop_select.val(app.defaults.stopId);
				}		
				
				$('.container main .content .routeInfo .routeStops').show();		
			}
			
		},

		events: {
			'click #showArivalTime': 'showArivalTime'
		},		

		getBusRouteStops: function (obj) {
			var busRouteStopModel = obj.models[0].attributes;
			var busRouteStops = {
				'stops': []
			};


			//First: loop through the stops for the selected direction.
			_.each( busRouteStopModel.directionStops.stop, function(directionStops) {
				//Second: loop through the stops for the root to test if they are part of the selected direction.
				var newDirectionStopTag = directionStops.attributes.tag;
				newDirectionStopTag = newDirectionStopTag.replace('_ar','');			
				_.each( busRouteStopModel.routeStops, function(routeStops, j) {
					if ( newDirectionStopTag === routeStops.attributes.tag ) {	
						busRouteStops.stops.push(routeStops);
					}
				});
			});			

			return busRouteStops;
		},

		showArivalTime: function(e) {
			if ( this.$stop_select.val() !== 0 ) {
				app.defaults.stopTag = this.$stop_select.val();
				app.defaults.stopId = this.$stop_select.find('option:selected').attr('data-stopId');
				app.router.navigate('route/' + app.defaults.routeNumber + '/' + 'direction' + '/' + encodeURIComponent(app.defaults.directionVar) + '/' + 'stop' + '/' + app.defaults.stopTag, {trigger: true});  
			}			
			return false;
		},

		close: function() {
			if ( this.$stop_select.length ) {
				this.$stop_select.find('option:gt(0)').remove();
			}
			this.$el.hide();
			this.$el.unbind();
			app.defaults.stopId = 0;
			app.defaults.stopTag = 0;			
		}
	});
})();