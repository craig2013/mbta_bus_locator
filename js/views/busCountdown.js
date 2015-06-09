var app = app || {};

(function() {
	'use strict';
	
	app.views.busCountdown = Backbone.View.extend({
		el: '.bus-countdown-container',
		template: _.template($('#tpl-bus-minutes').html()),

		initialize: function() {
			//Clear any existing timers
			this.clearTimer();

			//Fetch busCountdown collection
			this.getBusCountdown();			

			this.listenTo(app.collections.busCountdown, 'add', this.render);
		}, 
		render: function() {
			var busData = {};
			var predictionsCount = 0;
			var predictionModel = {}; 			
			var self = this;
			var showAffectedByLayover = false;
			var showNoPredictions = false;


			if ( _.isObject(this.model.models[0]) ) {
				
				/*Todo: Fix render function being called twice when switching between routes only.*/
				this.clearCountdown();

				predictionModel = this.model.models[0].attributes;

				busData = this.getBusPredictions(predictionModel.predictions);			

				this.$el.find('.bus-predictions, .no-bus-predictions').hide();

				if ( Array.isArray(busData.predictions) ) { 	

					//Show no predictions message if it's only item in the model
					if ( (typeof busData.predictions[0].attributes.dirTitleBecauseNoPredictions !== 'undefined' ) && (busData.predictions.length === 1) ) {
						this.$el.find('.bus-predictions').hide();
						this.$el.find('.no-bus-predictions').show();
					} else {

						
						//If there are multiple directions returned for a stop sort by direction and minutes of prediction
						busData.predictions.sort(function(a, b) {

							//Test if a.attributes or b.attributes, and a.attributes.dirTag or b.attributes.dirTag exists first
							if ( typeof a.attributes === 'undefined' || typeof a.attributes.dirTag === 'undefined' || typeof a.attributes.minutes === 'undefined' ) {
								return 1;
							}

							if ( typeof b.attributes === 'undefined' || typeof b.attributes.dirTag === 'undefined' || typeof b.attributes.minutes === 'undefined' ) {
								return 0;
							}

							//Dirtag and minutes for a
							var aDirTag = parseInt(a.attributes.dirTag.substring(0, a.attributes.dirTag.indexOf('_')));
							var aMin = parseInt(a.attributes.minutes);

							//Dirtag and minutes for b
							var bDirTag = parseInt(b.attributes.dirTag.substring(0, b.attributes.dirTag.indexOf('_')));
							var bMin = parseInt(b.attributes.minutes);

							return ( aDirTag === bDirTag )? aMin - bMin : aDirTag - bDirTag;

						});	

						for ( var i = 0; i < busData.predictions.length; i++ ) {

							if ( typeof busData.predictions[i].attributes !== undefined ) {

								if ( typeof busData.predictions[i].attributes.minutes !== undefined ) {

									var affectedByLayover = busData.predictions[i].attributes.affectedByLayover;
									var defaultDirTag = app.defaults.directionVar.substring(0, app.defaults.directionVar.indexOf('_'));
									var dirTag = busData.predictions[i].attributes.dirTag.substring(0, busData.predictions[i].attributes.dirTag.indexOf('_'));
									var minutes = busData.predictions[i].attributes.minutes;

									self.$el.find('.no-bus-predictions').hide();

									if ( dirTag === defaultDirTag ) {
										if ( predictionsCount <= 2 ) {

											if ( predictionsCount >= 1 && minutes >= 1 ) {
												var $first = self.$el.find('.bus-predictions .bus-times .bus-time:first').clone();
												$($first).appendTo(self.$el.find('.bus-predictions .bus-times'));

												var $cur = self.$el.find('.bus-predictions .bus-times .bus-time:last');
											} else {
												var $cur = self.$el.find('.bus-predictions .bus-times .bus-time:first');
											}
														
											if ( minutes >= '1' ) { 
												$cur.find('.next-bus-arriving').hide();
												$cur.find('.minutes').empty().text(minutes);
											} else if ( (minutes === '0') && ( i === 0) ) {
												$cur.find('.minutes').empty();
												$cur.find('.next-bus-arriving').show();
											}

											if ( affectedByLayover ) {
												$cur.find('.disclaimer').show();
												showAffectedByLayover = true;
											} else {
												$cur.find('.disclaimer').hide();
												showAffectedByLayover = false;
											}

											$cur.show();
											predictionsCount++;	
										} 						
									}							
								}
							} //end typeof busData.predictions[i].attributes
						}

						if ( predictionsCount ) {
							//Show disclaimer for busses affected  by layover.
							if ( showAffectedByLayover ) {
								this.$el.find('.bus-predictions .disclaimer-text').show();
							} else {
								this.$el.find('.bus-predictions .disclaimer-text').hide();
							}

							this.$el.find('.bus-predictions .bus-times .bus-time:first').addClass('next-bus-time');

							this.$el.find('.bus-predictions').show();
						} else {
							this.$el.find('.bus-predictions').hide();
							this.$el.find('.no-bus-predictions').show();						
						}									
					}				
			

					//Show .bus-countdown-container
					this.$el.show();
				}// end if(Array.isArray)
			}

		},
		/**
		* This function will get the bus predictions from the direction service.
		**/			
		getBusCountdown: function() {
			var self = this;

			app.settings = {
				'busCountdownTimer': 0
			};

			app.collections.busCountdown.fetch({
				traditional: true,
				data: {
					'command': 'predictions', 
					'agency': app.defaults.agencyTag,
					'stopId': app.defaults.stopId 
				}
			});

			//Update bus predictions 
			app.settings.busCountdownTimer = setTimeout(function() {
				self.getBusCountdown();
			}, app.defaults.refreshPredictionsTime);			

		},
		/**
		* Function that returns the predictions for a stop after a direction is chosen.
		* 
		* @param obj This is the predictions object.
		* 
		* @return The bus predictions as either an object or an array of objects.
		**/		
		getBusPredictions: function(obj) { 
			var busPredictions = obj;
			var predictionsData = {
				'predictions': []
			};


			if ( Array.isArray(obj) ) { //Multiple predictions for a stop
				for ( var i = 0; i < obj.length; i++ ) {
					if ( (typeof obj[i].direction === 'object') && (!Array.isArray(obj[i].direction)) ) {
						if ( Array.isArray(obj[i].direction.prediction) ) {
							for ( var j = 0; j < obj[i].direction.prediction.length; j++ ) {
								predictionsData.predictions.push(obj[i].direction.prediction[j]);
							}
 
						} else if ( !Array.isArray(obj[i].direction.prediction) ) {
							predictionsData.predictions.push(obj[i].direction.prediction);
						}

					} else if ( Array.isArray(obj[i].direction) ) { //The prediction has multiple directions

						for ( var j = 0; j < obj[i].direction.length; j++ ) {

							for ( var k = 0; k < obj[i].direction[j].prediction.length; k++) {
								if ( typeof obj[i].direction[j].prediction[k] !== 'undefined' ) {
									predictionsData.predictions.push(obj[i].direction[j].prediction[k]);
								}
							}

						}

					}

				} //end outer for
			} else if ( Array.isArray(obj.direction) ) { //Multiple directions for a stop
				for ( var i = 0; i < obj.direction.length; i++ ) {
					if ( typeof obj.direction[i].prediction === 'object' ) {
						if ( typeof obj.direction[i].prediction.attributes === 'object' ){
							predictionsData.predictions.push(obj.direction[i].prediction);
						}
					}
				}
			} else if ( typeof obj.direction === 'object' ) { //Only 1 direction for stop
				if ( Array.isArray(obj.direction.prediction) ) {
					for ( var i =  0; i < obj.direction.prediction.length; i++ ) { //Multiple predictions for a direction
						predictionsData.predictions.push(obj.direction.prediction[i]);
					}
				} else if ( (typeof obj.direction.prediction === 'object') && (!Array.isArray(obj.direction.prediction)) ) { //Only 1 prediction for a direction
					predictionsData.predictions.push(obj.direction.prediction);
				}
			} else if ( typeof obj.attributes === 'object' ) { //No bus predictions for selected stop and/or route 
				predictionsData.predictions.push(obj);
			}
			
			return predictionsData;

		},
		clearCountdown: function() {
			//Clear any bus predictions
			this.$el.find('.bus-predictions .bus-times .bus-time:gt(0)').each(function() {
				$(this).remove();
			});
			this.$el.find('.bus-predictions .bus-times .bus-time:first').removeClass('next-bus-time');
			this.$el.find('.bus-predictions .bus-times .bus-time:first .minutes').empty();
		},
		clearTimer: function() {
			//Clear the refresh predictions timmer
			window.clearTimeout(app.settings.busCountdownTimer);
			app.settings.busCountdownTimer = 0;			
		},
		close: function() {
			this.clearTimer();

			this.clearCountdown();

			//Hide the .bus-countdown container
			this.$el.hide();	

			this.$el.unbind();
		}
	});
})();





