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
			var busRouteStops = {};
			var busRouteStopModel = this.model;

			busRouteStops = this.getBusRouteStops(busRouteStopModel);

			this.$stop_select = $('#stop_select');	

			if ( Array.isArray(busRouteStops.stops) ) {
				this.$stop_select.find('option:gt(0)').remove();

				busRouteStops = _.sortBy(busRouteStops.stops, 'title');

				for ( var i = 0; i < busRouteStops.length; i++ ) {
					if ( typeof busRouteStops[i] === 'object' ) {
						var busStopItems = {
							'stopId': '',
							'dirTag': '',
							'title': '' 
						};
						if ( typeof busRouteStops[i].attributes.tag === 'string' && typeof busRouteStops[i].attributes.stopId === 'string' && typeof busRouteStops[i].attributes.title === 'string' ) {
							busStopItems.dirTag = busRouteStops[i].attributes.tag;
							busStopItems.stopId = busRouteStops[i].attributes.stopId;
							busStopItems.title = busRouteStops[i].attributes.title;

							self.$stop_select.append(self.template(busStopItems));
						}
					}
				}

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

			if ( Array.isArray(busRouteStopModel.directionStops.stop) ) {

				//First: loop through the stops for the selected direction.
				for ( var i = 0; i < busRouteStopModel.directionStops.stop.length; i++ ) {

					var newDirectionStopTag = busRouteStopModel.directionStops.stop[i].attributes.tag;
					newDirectionStopTag = newDirectionStopTag.replace('_ar','');	
					
					//Second: loop through the stops for the root to test if they are part of the selected direction.
					for ( var j = 0; j < busRouteStopModel.routeStops.length; j++ ) {
						if ( newDirectionStopTag === busRouteStopModel.routeStops[j].attributes.tag ) {	
							busRouteStops.stops.push(busRouteStopModel.routeStops[j]);
						}
					}

				}
			} else if ( Array.isArray(busRouteStopModel.routeStops) && (!Array.isArray(busRouteStopModel.directionStops.stop)) ) { //No stops for specific direction chosen.
				for ( var i = 0; i < busRouteStopModel.routeStops.length; i++ ) {
					busRouteStops.stops.push(busRouteStopModel.routeStops[i]);
				}
			}			

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