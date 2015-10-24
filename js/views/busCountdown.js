//bus countdown
define([
            'jquery',
            'underscore',
            'backbone',
            'models/busCountdown',
            'collections/busCountdown',
            'utility/getBusPredictions',
            'utility/sortRoutes',
            'utility/sortPredictions',
            'text!templates/busCountdown.html',
            'text!templates/alsoAtStop.html'], function($,  _, Backbone, busCountdownModel, busCountdownCollection, getPredictionsUtility, sortRoutesUtility, sortPredictionsUtility, countdownTemplate, alsoAtTemplate) {

            var countdownView = Backbone.View.extend({
                el: '.bus-countdown-container',

                initialize: function () {
                    var self = this;
                    var collectionOptions = {
                        traditional: true,
                        data: {
                            'command': 'predictions',
                            'agency': Backbone.app.defaults.agencyTag,
                            'stopId': Backbone.app.defaults.stopId
                        }                        
                    };

                    //Clear any existing timers
                    this.clearTimer();
                    
                    //Fetch busCountdown collection 
                    var updatePredictions = function() {
                        busCountdownCollection.fetch(collectionOptions);
                        Backbone.app.settings.busCountdownTimer = setTimeout(updatePredictions, Backbone.app.defaults.refreshPredictionsTime);
                    };

                    //Update bus predictions
                    updatePredictions();

                    this.listenTo( busCountdownCollection, 'sync', this.render );
                },               
                
                render: function() {
                    var alsoAtStopPredictions = false;
                    var busData = {};
                    var busStopPredictions = false;
                    var predictionsCount = 0;
                    var predictionModel = {};
                    var self = this;
                    var showAffectedByLayover = false;
                    var showNoPredictions = false;        
                    
                    if ( typeof this.model.models[ 0 ] === 'object' ) {
                        //Reset the bus countdown container by clearing it first
                        this.clearCountdown();

                        //Set the model
                        predictionModel = this.model.models[ 0 ].attributes;
                        busData = getPredictionsUtility.getBusPredictions( predictionModel.predictions );

                        busData = sortRoutesUtility.sortRoutes( busData );            
                        
                        if ( typeof busData === 'object' ) {
                            if ( busData.hasOwnProperty( 'predictions' ) ) {
                                if ( Array.isArray( busData.predictions ) && ( busData.predictions.length>=1 ) ) {
                                    //Bus schedule link URL
                                    var busScheduleURL = 'http://www.mbta.com/schedules_and_maps/bus/routes/?route=';
                                    var countDownTemplate =  _.template( countdownTemplate );
                                    var data = {
                                        'busTimes': busData
                                    };

                                    var routeString = '';

                                    if ( Backbone.app.defaults.routeNumber === '741' || 
                                         Backbone.app.defaults.routeNumber === '742' || 
                                         Backbone.app.defaults.routeNumber === '751' || 
                                         Backbone.app.defaults.routeNumber === '751' || 
                                         Backbone.app.defaults.routeNumber === '749' || 
                                         Backbone.app.defaults.routeNumber === '746' || 
                                         Backbone.app.defaults.routeNumber === '701' || 
                                         Backbone.app.defaults.routeNumber === '747' || 
                                         Backbone.app.defaults.routeNumber === '708' ) {
                                        routeString = Backbone.app.defaults.routeNames[ Backbone.app.defaults.routeNumber ].shortName;
                                    } else {
                                        routeString = Backbone.app.defaults.routeNumber;
                                    }

                                    busScheduleURL += routeString;

                                    this.$el.find( '.selected-route-container .bus-schedule a' ).attr( 'href', busScheduleURL );

                                    if ( ( busData.predictions.length === 1 ) && ( typeof busData.predictions[ 0 ].attributes.dirTitleBecauseNoPredictions === 'string' ) ) {
                                        //If no predictions for selected route then show no predictions message
                                        this.$el.find( '.selected-route-container .no-bus-predictions' ).show();
                                        this.$el.find( '.bus-stop-container .also-at-stop-container' ).hide();
                                        this.$el.find( '.selected-route-container .map-text' ).hide();
                                        this.$el.find( '.selected-route-container' ).show();
                                    } else {
                                        //Render predictions
                                        this.$el.find( '.selected-route-container .no-bus-predictions' ).hide();

                                        predictionsCount = busData.predictions.length;

                                        this.$el.find( '.selected-route-container .bus-times' ).html( countDownTemplate(data) );

                                        if ( predictionsCount ) {

                                            if ( busData.showFooterDisclaimer ) {
                                                $( '.bus-countdown-container .bus-stop-container .selected-route-container .disclaimer-text' ).show();
                                            } else {
                                                $( '.bus-countdown-container .bus-stop-container .selected-route-container .disclaimer-text' ).hide();
                                            }

                                            this.$el.find( '.selected-route-container, .selected-route-container .bus-times' ).show();
                                        }
                                    } //busData.predictions.length === 1
                                }//Array.isArray( busData.predictions )
                            }//busData.hasOwnProperty( 'predictions' )

                            if ( busData.hasOwnProperty( 'alsoAtStop' ) ) {
                                if ( Array.isArray( busData.alsoAtStop ) ) {
                                    if ( ( busData.alsoAtStop.length === 0 ) || ( busData.alsoAtStop.length === 1 ) && ( typeof busData.alsoAtStop[ 0 ].attributes.dirTitleBecauseNoPredictions === 'string' ) ) {
                                        this.$el.find( '.bus-stop-container .also-at-stop-container' ).hide();
                            } else {
                                        if ( busData.alsoAtStop.length >= 1 ) {
                                            var alsoAtStopModel = busData.alsoAtStop;
                                            var alsoAtStopTemplate = _.template( alsoAtTemplate );
                                            var busData = ( alsoAtStopModel.length > 4 && Array.isArray( alsoAtStopModel ) ) ? alsoAtStopModel.slice( 0, 4 ) : alsoAtStopModel;
                                            var alsoAtStopdata = {
                                                'busTimes': busData
                                            };

                                            this.$el.find(  '.bus-stop-container .also-at-stop-container .bus-times' ).html( alsoAtStopTemplate(alsoAtStopdata) );

                                            this.$el.find( '.bus-stop-container .also-at-stop-container' ).show();
                                        }

                                    } //busData.alsoAtStop.length === 1                     
                                } //Array.isArray(busData.alsoAtStop    
                            } //busData.hasOwnProperty('alsoAtStop')

                            this.$el.show();
                        }//typeof busData === 'object'        
                    }//typeof this.model.models[ 0 ] === 'object'     
                },

                clearCountdown: function () {
                    //Clear any bus predictions
                    this.$el.find( '.bus-stop-container .selected-route-container .bus-times .bus-time' ).each( function () {
                        $( this ).remove();
                    } );

                    if ( this.$el.find( '.bus-stop-container .also-at-stop-container .bus-times .bus-time' ).length ) {
                        this.$el.find( '.bus-stop-container .also-at-stop-container .bus-times .bus-time' ).each( function () {
                            $( this ).remove();
                        } );  
                    }                  
                },

                clearTimer: function () {
                    //Clear the refresh predictions timmer
                    window.clearTimeout( Backbone.app.settings.busCountdownTimer );
                    Backbone.app.settings.busCountdownTimer = 0;
                },

                close: function () {
                    this.clearTimer();

                    this.clearCountdown();

                    this.$el.find( '.bus-stop-container .selected-route-container .disclaimer-text' ).hide();

                    //Hide the .bus-countdown container
                    this.$el.hide();

                    this.$el.unbind();
                }
            });

            return countdownView;
});