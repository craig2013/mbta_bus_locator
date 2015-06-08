var app = app || {};

(function() {
	'use strict';
	
	app.views.busRouteDirections = Backbone.View.extend({

		el: '.routeDirection',
		template: _.template($('#tpl-route-direction').html()),
		tagName: 'option',

		initialize: function() {
			app.collections.busRouteDirections.fetch({
				traditional: true,
				data: {
					'command': 'direction', 
					'agency': app.defaults.agencyTag,
					'route': app.defaults.routeNumber
				}
			});
			this.listenTo(app.collections.busRouteDirections, 'add', this.render);
		},

		render: function(e) {
			var busDirectionItems = {};
			var busDirectionModel = this.model.models;
			var self = this;

			busDirectionItems = this.getBusDirections(busDirectionModel);
			
			this.$direction_select = $('#direction_select');

			this.$direction_select.find('option:gt(0)').remove();
			
			if ( Array.isArray(busDirectionItems.directions) ) {
				busDirectionItems = _.sortBy(busDirectionItems.directions, 'directionText');

				for ( var i = 0; i < busDirectionItems.length; i++ ) {
					self.$direction_select.append(self.template(busDirectionItems[i]));
				}
			}
			

			
			if ( (isNaN(app.defaults.directionVar) && app.defaults.directionVar.length) ) {
				this.$direction_select.val(app.defaults.directionVar); 

				if ( app.defaults.directionText === 0 ) {
					app.defaults.directionText = this.$direction_select.find('option:selected').text();
				}


				$('.container main .content .routeInfo .routeDirection').show();
			} else {
				this.$direction_select.val(0); 
				$('.container main .content .routeInfo .routeDirection').show();
			}
						
		},

		events: {
			'click #getDirectionStops': 'showDirectionStops'
		},

		/**
		* Function that returns directions available for a selected stop. (Maybe move this to directions view (?))
		* 
		* @param obj This is the predictions object.
		* 
		* @return The directions for a selected stop.
		*/
		getBusDirections: function(obj) {
			var busDirections = obj;
			var directionData = {
				'directions': []
			};
			
			for ( var i = 0; i < busDirections.length; i++ ) {
				var obj = busDirections[i];
				if ( typeof obj.attributes === 'object' ) {
					if ( typeof obj.attributes.attributes === 'object' ) {
						var directionsItem = {
						'dirTag': '',
							'directionText': ''
						};

						directionsItem.dirTag = ( typeof obj.attributes.attributes.tag === 'string' )? obj.attributes.attributes.tag : '';
						directionsItem.directionText = ( typeof obj.attributes.attributes.title === 'string' )? obj.attributes.attributes.title : '';

						if ( (typeof directionsItem.directionText === 'string' && directionsItem.directionText.length) && (typeof directionsItem.dirTag === 'string' && directionsItem.dirTag.length) ) {
							directionData.directions.push(directionsItem);
						}
					}
				}	
			}

			return directionData;

		},

		showDirectionStops: function(e) {
			if ( this.$direction_select.val() ) {
				app.defaults.directionVar = this.$direction_select.val();
				app.defaults.directionText = this.$direction_select.find('option:selected').text();	
				app.router.navigate('route/' + app.defaults.routeNumber +  '/direction/' + encodeURIComponent(app.defaults.directionVar), {trigger: true}); 			
			}

			return false;
		},

		close: function() {
			if ( this.$direction_select.length ) {
				this.$direction_select.find('option:gt(0)').remove();
			}
			
			$('.container main .content .routeInfo .routeDirection').hide();

		           this.$el.unbind();

			app.defaults.directionText = 0;
			app.defaults.directionVar = 0;	            
		}
	});
})();
