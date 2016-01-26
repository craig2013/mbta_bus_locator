//Selected bus route countdwn
define( [
    'jquery',
    'underscore',
    'backbone',
    'models/busCountdown',
    'collections/busCountdown',
    'utility/getBusPredictions',
    'utility/sortRoutes',
    'utility/sortPredictions',
    'utility/getRouteName',
    'views/alsoAtStop',
    'text!templates/bus-countdown/selectedRoute.html'
], function ( $, _, Backbone, busCountdownModel, busCountdownCollection,
    getPredictionsUtility, sortRoutesUtility, sortPredictionsUtility, getRouteNameUtility,
    alsoAtStopView, selectedRouteTemplate ) {

    //To Do: Fix also at stop: route info

    var countdownView = Backbone.View.extend( {

        initialize: function () {
            this.clearTimer(); //Clear any existing timers

            this.setPredictions(); //Function to fetch predictions and set update timer

            this.listenTo( busCountdownCollection, 'sync', this.render );
        },

        render: function () {
            var alsoAtStopPredictions = false;
            var busData = {};
            var busStopPredictions = false;
            var predictionsCount = 0;
            var predictionModel = {};
            var self = this;
            var showAffectedByLayover = false;
            var showNoPredictions = false;

            if ( typeof this.model.models[ 0 ] === 'object' ) {
                //Set the model
                predictionModel = this.model.models[ 0 ].attributes;
                Backbone.app.predictionModel = this.model.models[ 0 ];
                busData = getPredictionsUtility.getBusPredictions( predictionModel.predictions );
                busData = sortRoutesUtility.sortRoutes( busData );

                if ( typeof busData === 'object' ) {
                    if ( busData.hasOwnProperty( 'predictions' ) ) {
                        if ( Array.isArray( busData.predictions ) ) {

                            //Bus schedule link URL
                            var busScheduleURL = 'http://www.mbta.com/schedules_and_maps/bus/routes/?route=';
                            var selectedRoute = _.template( selectedRouteTemplate );
                            var data = {
                                'busTimes': busData,
                                'noPredictions': false
                            };

                            var routeString = ( typeof getRouteNameUtility.getRouteName( Backbone.app.defaults.routeNumber, 'shortName' ) === 'string' ) ? getRouteNameUtility.getRouteName( Backbone.app.defaults.routeNumber, 'shortName' ) : Backbone.app.defaults.routeNumber;
                            var mapURL = '/map/?a=' + Backbone.app.defaults.agencyTag + '&r=' + Backbone.app.defaults.routeNumber + '&d=' + Backbone.app.defaults.directionVar + '&s=' + Backbone.app.defaults.stopId;

                            busScheduleURL += routeString;

                            if ( ( ( busData.predictions.length === 1 ) && ( typeof busData.predictions[ 0 ].attributes.dirTitleBecauseNoPredictions === 'string' ) ) ) {
                                //If no predictions for selected route then show no predictions message
                                data = {
                                    'busTimes': {
                                        'noPredictions': true
                                    }
                                };

                                this.$el.html( selectedRoute( data ) );

                                this.$el.find( '.bus-schedule-link' ).attr( 'href', busScheduleURL );
                                this.$el.find( '.no-bus-predictions' ).show();
                                this.$el.find( '.map-text' ).hide();
                                this.$el.show();
                            } else if ( busData.predictions.length >= 1 ) {
                                //Render predictions
                                this.$el.find( '.no-bus-predictions' ).hide();
                                this.$el.find( '.bus-schedule' ).hide();
                                this.$el.find( '.disclaimer-text' ).hide();
                                this.$el.find( '.map-text' ).hide();
                                this.$el.hide();


                                predictionsCount = busData.predictions.length;

                                data.busTimes.predictions = sortPredictionsUtility.sortPredictions( data.busTimes.predictions, 'sortByPrediction' );

                                this.$el.html( selectedRoute( data ) );

                                this.$el.find( '.bus-schedule-link' ).attr( 'href', busScheduleURL );

                                this.$el.find( '.show-map-link' ).attr( 'href', mapURL );

                                if ( predictionsCount >= 1 ) {

                                    if ( busData.showFooterDisclaimer ) {
                                        this.$el.find( '.disclaimer-text' ).show();
                                    } else {
                                        this.$el.find( '.disclaimer-text' ).hide();
                                    }

                                    this.$el.find( '.bus-times' ).show();
                                    this.$el.show();
                                }
                            } //busData.predictions.length === 1
                        } //Array.isArray( busData.predictions )
                    } //busData.hasOwnProperty( 'predictions' )

                    $( '.bus-countdown-container .bus-countdown-title' ).show();
                    $( '.bus-countdown-container .bus-stop-container' ).show();

                    //Todo: Move loading this view to the router and all of this to it's own view.
                    if ( busData.hasOwnProperty( 'alsoAtStop' ) ) {
                        var alsoAtStop = [];
                        var alsoAtStopCollection = {};
                        var alsoAtStopModel = {};
                        var busPredictions = {};

                        if ( ( busData.predictions.length >= 1 ) && ( busData.alsoAtStop.length >= 1 ) ) {

                            alsoAtStopModel = Backbone.Model.extend( {
                                initialize: function () {}
                            } );

                            alsoAtStopCollection = Backbone.Collection.extend( {
                                model: alsoAtStopModel
                            } );

                            for ( var i = 0; i < busData.alsoAtStop.length; i++ ) {
                                if ( typeof busData.alsoAtStop[ i ].attributes === 'object' ) {
                                    alsoAtStop[ i ] = new alsoAtStopModel( busData.alsoAtStop[ i ].attributes );
                                }
                            }

                            alsoAtStopCollection = new alsoAtStopCollection();

                            alsoAtStopCollection.add( alsoAtStop );

                            if ( this.childView ) {
                                this.childView.close();
                            }

                            this.childView = new alsoAtStopView( {
                                model: alsoAtStopCollection
                            } );

                            this.childView.render().$el;
                        }
                    } //busData.hasOwnProperty( 'alsoAtStop' )

                } //typeof busData === 'object'
            } //typeof this.model.models[ 0 ] === 'object'



            return this;
        },

        setPredictions: function () {
            var collectionOptions = {
                traditional: true,
                data: {
                    'command': 'predictions',
                    'agency': Backbone.app.defaults.agencyTag,
                    'stopId': Backbone.app.defaults.stopId
                }
            };
            var self = this;

            busCountdownCollection.fetch( collectionOptions );

            Backbone.app.settings.busCountdownTimer = setTimeout( function () {
                self.setPredictions();
            }, Backbone.app.defaults.refreshPredictionsTime );
        },

        //Todo: Maybe move this to it's own utility function so that it can be shared between busCountdown and alsoAtStop
        clearTimer: function () {
            clearTimeout( Backbone.app.settings.busCountdownTimer );
            Backbone.app.settings.busCountdownTimer = 0;
        },

        close: function () {
            this.clearTimer();

            if ( this.childView ) {
                this.childView.close();
                delete this.childView;
            }

            this.model.unbind();

            this.stopListening();

            this.$el.find( '.bus-times' ).unbind();
            this.$el.find( '.bus-times' ).remove();



            this.$el.find( '.no-bus-predictions' ).hide();
            this.$el.find( '.bus-schedule' ).hide();
            this.$el.find( '.disclaimer-text' ).hide();
            this.$el.find( '.map-text' ).hide();

            //Hide the .bus-countdown container
            this.$el.hide();

            $( '.bus-countdown-container .bus-countdown-title' ).hide();
            $( '.bus-countdown-container .bus-stop-container' ).hide();
        }
    } );

    return countdownView;
} );
