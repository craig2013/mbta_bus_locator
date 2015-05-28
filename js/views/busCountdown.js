var app = app || {};

(function() {
	'use strict';
	
	app.views.busCountdown = Backbone.View.extend({
		el: '.bus-countdown-container',
		template: _.template($('#tpl-bus-minutes').html()),

		initialize: function() {
			//Fetch busCountdown collection
			this.getBusCountdown();

			this.listenTo(app.collections.busCountdown, 'add', this.render);
		}, 
		render: function() {
			var self = this;
			var showAffectedByLayover = false;
			var showNoPredictions 
			var predictionModel = this.model.models[0].attributes;

			//var predictionModel = app.collections.directionArray245;
			//var predictionModel = app.collections.directionSingle245;
			//var predictionModel = app.collections.predictionArray245;
			//var predictionModel = app.collections.busRoute220;
			//var predictionModel = app.collections.silverLineTerminalA;
			//var predictionModel = app.collections.noPredictions;
			//var predictionModel = app.collections.silverLineWayNoPredictions;

			var busData = this.getBusPredictions(predictionModel.predictions);

			//console.log('getBusPredictions:');
			//console.log(busData);

			this.$el.find('.bus-predictions, .no-bus-predictions').hide();

			if ( Array.isArray(busData.predictions) ) {	

				//Show no predictions message if it's only item in the model
				if ( (typeof busData.predictions[0].dirTitleBecauseNoPredictions === 'string') && (busData.predictions.length === 1) ) {
					this.$el.find('.bus-predictions').hide();
					this.$el.find('.no-bus-predictions').show();
				} else {
					var predictionsCount = 0;

					//If there are multiple directions returned for a stop sort by direction and minutes of prediction
					busData.predictions.sort(function(a, b) {

						//Test if a.attributes or b.attributes exists first
						if ( typeof a.attributes === 'undefined' ) {
							return 1;
						}

						if ( typeof b.attributes === 'undefined' ) {
							return 0;
						}

						//First test if dirTag is undefined
						if ( typeof a.attributes.dirTag === 'undefined' ) {
							return 1;
						}
						if ( typeof b.attributes.dirTag === 'undefined' ) {
							return 0;
						}

						//Sort ascending based on dirTag value as a string
						if ( a.attributes.dirTag.toLowerCase() > b.attributes.dirTag.toLowerCase() ) {
							return 1;
						}

						if ( a.attributes.dirTag.toLowerCase() < b.attributes.dirTag.toLowerCase() ) {
							return -1;
						}

						//If dirTag is the same sort ascending by minutes as a integer
						if ( a.attributes.dirTag.toLowerCase() === b.attributes.dirTag.toLowerCase() ) {
							return parseInt(a.attributes.minutes) - parseInt(b.attributes.minutes);
						}

						return 0;
					});


					_.each(busData.predictions, function(obj,i) {
						if ( typeof obj.attributes === 'object' ) {
							if ( (typeof obj.attributes.minutes !== 'undefined') ) {
								var dirTag = obj.attributes.dirTag.substring(0,4);
								var defaultDirTag = app.defaults.directionVar.substring(0,4);
								var minutes = obj.attributes.minutes;
								var affectedByLayover = obj.attributes.affectedByLayover;
								self.$el.find('.no-bus-predictions').hide();


									if ( i === 0 ) {
										if ( dirTag === defaultDirTag ) {
											if ( minutes >= '1' ) {
												self.$el.find('.bus-predictions .next-bus-time .next-bus-arriving').hide();
												self.$el.find('.bus-predictions .next-bus-time .minutes').empty().text( minutes + ' min');
											} else {
												self.$el.find('.bus-predictions .next-bus-time .minutes').empty();
												self.$el.find('.bus-predictions .next-bus-time .next-bus-arriving').show();
											}

											if ( affectedByLayover ) {
												showAffectedByLayover = true;
												self.$el.find('.bus-predictions .next-bus-time .disclaimer').show();
											} else {
												showAffectedByLayover = false;
												self.$el.find('.bus-predictions .next-bus-time .disclaimer').hide();
											}

											self.$el.find('.bus-predictions .next-bus-time').show();
											predictionsCount++;
										}
									}
									

									if ( i === 1 ) {
										if ( dirTag === defaultDirTag ) {	 								
											self.$el.find('.bus-predictions .second-bus-time .minutes').empty().text( minutes + ' min');

											if ( affectedByLayover ) {
												showAffectedByLayover = true;
												self.$el.find('.bus-predictions .second-bus-time .disclaimer').show();
											} else {
												showAffectedByLayover = false;
												self.$el.find('.bus-predictions .second-bus-time .disclaimer').hide();
											}

											self.$el.find('.bus-predictions .second-bus-time').show();
											predictionsCount++;
										}
									}

									if ( i === 2 ) {
										if ( dirTag === defaultDirTag ) {
											self.$el.find('.bus-predictions .third-bus-time .minutes').empty().text( minutes + ' min');
											
											if ( affectedByLayover ) {
												showAffectedByLayover = true;
												self.$el.find('.bus-predictions .third-bus-time .disclaimer').show();
											} else {
												showAffectedByLayover = false;
												self.$el.find('.bus-predictions .third-bus-time .disclaimer').hide();
											}

											self.$el.find('.bus-predictions .third-bus-time').show();
											predictionsCount++;
										}
									}
							
		 					} //end typeof obj.attributes.minutes !== undefined  
	 					} //end typeof obj.attributes === 'object'
					}); //end _.each	
					
					if (predictionsCount) {
						//Show disclaimer for busses affected  by layover.
						if ( showAffectedByLayover ) {
							this.$el.find('.bus-predictions .disclaimer-text').show();
						} else {
							this.$el.find('.bus-predictions .disclaimer-text').hide();
						}

						if ( predictionsCount === 1 ) {
							this.$el.find('.bus-predictions .second-bus-time').hide();
							this.$el.find('.bus-predictions .third-bus-time').hide();
						}

						if ( predictionsCount === 2 ) {
							this.$el.find('.bus-predictions .third-bus-time').hide();
						}

						//Show .bus-predictions
						this.$el.find('.bus-predictions').show();
					} else {
						this.$el.find('.bus-predictions').hide();
						this.$el.find('.no-bus-predictions').show();
					}										
				}				
		

				//Show .bus-countdown-container
				this.$el.show();
			}

		},
		/**
		* This function will get the bus predictions from the direction service.
		**/			
		getBusCountdown: function() {
			var self = this;
			
			app.settings = {
				'busCountdownTimer': []
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
			},app.defaults.refreshPredictionsTime);			

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

			_.each(busPredictions, function(predictionsObj, i) {
				if (  typeof predictionsObj === 'object' ) {//predictions is an object

					if ( (typeof predictionsObj.direction === 'object' ) && !Array.isArray(predictionsObj) ) { //direction is an object

						if ( Array.isArray(predictionsObj.direction.prediction) ) {  //prediction is an array

							_.each(predictionsObj.direction.prediction, function(predictionObj) {
								predictionsData.predictions.push(predictionObj);
							});
						

						} else if ( (typeof predictionsObj.direction.prediction === 'object' ) && (!Array.isArray(predictionsObj.direction.prediction)) ) {
							predictionsData.predictions.push(predictionsObj.direction.prediction);

						}

					} else if ( (typeof predictionsObj === 'object' ) && (Array.isArray(predictionsObj)) ) { //direction is an array

						_.each(predictionsObj, function(directionObj) {

							if ( (typeof directionObj.prediction === 'object') && (!Array.isArray(directionObj.prediction)) ) {
								predictionsData.predictions.push(directionObj.prediction);
							} else if ( Array.isArray(directionObj.prediction) ) {
								_.each(directionObj.prediction, function(predictionObj) {
									predictionsData.predictions.push(predictionObj);
								});//end _.each

							}

						});//end _.each


					} else if ( Array.isArray(predictionsObj.prediction) ) {

						_.each(predictionsObj.prediction, function(predictionObj) {
							predictionsData.predictions.push(predictionObj);
						});					

					} else if ( (typeof predictionsObj.prediction === 'object') && (!Array.isArray(predictionsObj.prediction)) ) {
						if ( typeof predictionsObj.prediction.attributes === 'object' ) {
								predictionsData.predictions.push(predictionsObj.prediction);
						}			
					} else if ( typeof predictionsObj.dirTitleBecauseNoPredictions !== undefined ) {
						predictionsData.predictions.push(predictionsObj);
					}

				} 	

			}); //end _.each


			return predictionsData;

		},
		close: function() {
			window.clearTimeout(app.settings.busCountdownTimer);
			app.settings.busCountdownTimer = 0;
			this.$el.hide();
			this.$el.find('.next-bus-time .minutes, .second-bus-time .minutes, .third-bus-time .minutes').empty();
			this.$el.unbind();
		}
	});
})();





