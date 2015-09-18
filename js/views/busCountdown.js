var app = app || {};

( function () {
    'use strict';

    app.views.busCountdown = Backbone.View.extend( {
        el: '.bus-countdown-container',

        template: _.template( $( '#tpl-bus-countdown' ).html() ),

        initialize: function () {
            //Clear any existing timers
            this.clearTimer();

            //Fetch busCountdown collection
            this.getBusCountdown();

            this.listenTo( app.collections.busCountdown, 'sync', this.render );
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
                //Reset the bus countdown container by clearing it first
                this.clearCountdown();


                //Set the model
                predictionModel = this.model.models[ 0 ].attributes;
                busData = this.getBusPredictions( predictionModel.predictions );

                busData = this.sortRoutes( busData );


                if ( typeof busData === 'object' ) {
                    if ( busData.hasOwnProperty( 'predictions' ) ) {
                        if ( Array.isArray( busData.predictions ) ) {
                            //Bus schedule link URL
                            busData.predictions = this.sortPredictions(busData.predictions);
                            var busScheduleURL = 'http://www.mbta.com/schedules_and_maps/bus/routes/?route=';
                            var busTimeTemplate = {};
                            var routeString = '';

                            busTimeTemplate = this.template( {
                                                                'busTimes': busData
                                                            } );                            

                            if ( app.defaults.routeNumber === '741' || app.defaults.routeNumber === '742' || app.defaults.routeNumber === '751' || app.defaults.routeNumber === '751' || app.defaults.routeNumber === '749' || app.defaults.routeNumber === '746' || app.defaults.routeNumber === '701' || app.defaults.routeNumber === '747' || app.defaults.routeNumber === '708' ) {
                                routeString = app.defaults.routeNames[ app.defaults.routeNumber ].shortName;
                            } else {
                                routeString = app.defaults.routeNumber;
                            }

                            busScheduleURL += routeString;

                            this.$el.find( '.selected-route-container .bus-schedule a' ).attr( 'href', busScheduleURL );


                            if ( (( busData.predictions.length === 1 ) && ( typeof busData.predictions[ 0 ].attributes.dirTitleBecauseNoPredictions === 'string' )) || ( busData.predictions.length === 0 ) ) {
                                //If no predictions for selected route then show no predictions message
                                this.$el.find( '.selected-route-container .no-bus-predictions' ).show();
                                this.$el.find( '.bus-stop-container .also-at-stop-container' ).hide();
                                this.$el.find( '.selected-route-container .map-text' ).hide();
                                this.$el.find( '.selected-route-container' ).show();
                            } else {
                                //Render predictions
                                this.$el.find( '.selected-route-container .no-bus-predictions' ).hide();

                                predictionsCount = busData.predictions.length;

                                this.$el.find( '.selected-route-container .bus-times' ).html( busTimeTemplate );

                                if ( predictionsCount ) {

                                    if ( busData.showFooterDisclaimer ) {
                                        $( '.bus-countdown-container .bus-stop-container .selected-route-container .disclaimer-text' ).show();
                                    } else {
                                        $( '.bus-countdown-container .bus-stop-container .selected-route-container .disclaimer-text' ).hide();
                                    }

                                    this.$el.find( '.selected-route-container' ).show();
                                }
                            } //busData.predictions.length === 1
                        } //Array.isArray(busData.predictions
                    } //busData.hasOwnProperty('predictions')

                    if ( busData.hasOwnProperty( 'alsoAtStop' ) ) {
                        if ( Array.isArray( busData.alsoAtStop ) ) {
                            if ( ( busData.alsoAtStop.length === 0 ) || ( busData.alsoAtStop.length === 1 ) && ( typeof busData.alsoAtStop[ 0 ].attributes.dirTitleBecauseNoPredictions === 'string' ) ) {
                                this.$el.find( '.bus-stop-container .also-at-stop-container' ).hide();
                            } else {
                                if ( busData.alsoAtStop.length >= 1 ) {
                                    var alsoAtStopModel = busData.alsoAtStop;

                                    alsoAtStopModel = this.sortPredictions(alsoAtStopModel);
                                    var childView = new app.views.busAlsoAtStop( {
                                        model: alsoAtStopModel
                                    } );
                                    childView.render();

                                    this.$el.find( '.bus-stop-container .also-at-stop-container' ).show();
                                }

                            } //busData.alsoAtStop.length === 1						
                        } //Array.isArray(busData.alsoAtStop	
                    } //busData.hasOwnProperty('alsoAtStop')

                } //typeof busData === 'object'



                this.$el.show();
            }

            return this;

        },
        events: {
            'click .show-map-link': 'showMap'
        },
        /**
         * This function will get the bus predictions from the direction service.
         **/
        getBusCountdown: function () {
            var self = this;

            app.settings = {
                'busCountdownTimer': 0
            };

            app.collections.busCountdown.fetch( {
                traditional: true,
                data: {
                    'command': 'predictions',
                    'agency': app.defaults.agencyTag,
                    'stopId': app.defaults.stopId
                }
            } );

            //Update bus predictions 
            app.settings.busCountdownTimer = setTimeout( function () {
                self.getBusCountdown();
            }, app.defaults.refreshPredictionsTime );

        },
        /**
         * Function that returns the predictions for a stop after a direction is chosen.
         *
         * @param obj This is the predictions object.
         *
         * @return The bus predictions as either an object or an array of objects.
         **/
        getBusPredictions: function ( obj ) {
            var busPredictions = obj;
            var predictionsData = {
                'predictions': []
            };

            if ( Array.isArray( busPredictions ) ) { //Multiple predictions for a stop


                //Test if no predictions exist for a route
                var noPredictions = _.find( busPredictions, function ( obj ) {
                    return ( typeof obj.attributes.dirTitleBecauseNoPredictions === 'string' ) ? obj.attributes.dirTitleBecauseNoPredictions : '';
                } );

                var res = _( busPredictions ).chain().
                flatten().
                pluck( 'direction' ).
                without( undefined ).
                flatten().
                pluck( 'prediction' ).
                flatten().
                without( undefined );


                if ( typeof res === 'object' ) {
                    if ( Array.isArray( res._wrapped ) ) {
                        predictionsData.predictions = res._wrapped;
                    } else {
                        predictionsData.predictions.push( res._wrapped );

                    }
                }

                if ( typeof noPredictions === 'object' ) {
                    predictionsData.predictions.push( noPredictions );
                }

            } else if ( Array.isArray( busPredictions.direction ) ) { //Multiple directions for a stop
                var res = _( busPredictions.direction ).chain().
                flatten().
                pluck( 'prediction' );

                if ( typeof res === 'object' ) {
                    if ( Array.isArray( res._wrapped ) ) {
                        predictionsData.predictions = res._wrapped;
                    } else {
                        predictionsData.predictions.push( res._wrapped );
                    }
                }

            } else if ( typeof busPredictions.direction === 'object' && !Array.isArray( busPredictions.direction ) ) { //Only 1 direction for stop
                if ( Array.isArray( busPredictions.direction.prediction ) ) {
                    for ( var i = 0; i < busPredictions.direction.prediction.length; i++ ) { //Multiple predictions for a direction
                        predictionsData.predictions.push( busPredictions.direction.prediction[ i ] );
                    }
                } else if ( ( typeof busPredictions.direction.prediction === 'object' ) && ( !Array.isArray( busPredictions.direction.prediction ) ) ) {
                    predictionsData.predictions.push( busPredictions.direction.prediction );
                }
            } else if ( typeof obj.attributes === 'object' && typeof obj.attributes.dirTitleBecauseNoPredictions === 'string' ) { //No bus predictions for selected stop and/or route 

                predictionsData.predictions.push( obj );
            }


            return predictionsData;

        },
        /**
         * Function that returns the predictions sorted for either the route selected or bus routes that also stop at the bus stop.
         *
         * @param obj This is the predictions object.
         *
         * @return The bus predictions containing an array of objects called predictions, an  array of obects called alsoAtStop, and showFooterDisclaimer.
         **/
        sortRoutes: function ( obj ) {
            var sortedPredictions = {
                'predictions': [],
                'alsoAtStop': [],
                'showFooterDisclaimer': false
            };

            _.map( obj.predictions, function ( o, i ) {
                var showDisclaimer = false;

                if ( typeof o.attributes.dirTitleBecauseNoPredictions === 'string' ) {
                    if ( o.attributes.routeTag === app.defaults.routeNumber ) {
                        sortedPredictions.predictions.push( o );

                        if ( o.attributes.affectedByLayover === 'true' ) {
                            showDisclaimer = true;
                        }
                    } else {
                        //Set route name for display with Also at this stop
                        var routeNumber = ( typeof o.attributes.dirTag === 'string' ) ? o.attributes.dirTag.substring( 0, 3 ) : '';
                        var routeName = '';

                        if ( routeNumber === '741' ) {
                            routeName = app.defaults.routeNames[ '741' ].longName;
                        } else if ( routeNumber === '742' ) {
                            routeName = app.defaults.routeNames[ '742' ].longName;
                        } else if ( routeNumber === '746' ) {
                            routeName = app.defaults.routeNames[ '746' ].longName;
                        } else if ( routeNumber === '749' ) {
                            routeName = app.defaults.routeNames[ '749' ].longName;
                        } else if ( routeNumber === '751' ) {
                            routeName = app.defaults.routeNames[ '751' ].longName;
                        } else {
                            routeName = ( typeof o.attributes.dirTag === 'string' ) ? o.attributes.dirTag.substring( 0, 3 ).replace( '_', ' ' ) : '';
                        }

                        o.attributes[ 'routeName' ] = routeName;

                        if ( routeName )
                            sortedPredictions.alsoAtStop.push( o );
                    }
                } else {
                    if ( o.attributes.dirTag.substring( 0, 3 ) === app.defaults.directionVar.substring( 0, 3 ) ) {
                        sortedPredictions.predictions.push( o );

                        if ( o.attributes.affectedByLayover === 'true' ) {
                            showDisclaimer = true;
                        }
                    } else {
                        //Set route name for display with Also at this stop
                        var routeNumber = ( typeof o.attributes.dirTag === 'string' ) ? o.attributes.dirTag.substring( 0, 3 ) : '';
                        var routeName = '';

                        if ( routeNumber === '741' ) {
                            routeName = app.defaults.routeNames[ '741' ].longName;
                        } else if ( routeNumber === '742' ) {
                            routeName = app.defaults.routeNames[ '742' ].longName;
                        } else if ( routeNumber === '746' ) {
                            routeName = app.defaults.routeNames[ '746' ].longName;
                        } else if ( routeNumber === '749' ) {
                            routeName = app.defaults.routeNames[ '749' ].longName;
                        } else if ( routeNumber === '751' ) {
                            routeName = app.defaults.routeNames[ '751' ].longName;
                        } else {
                            routeName = ( typeof o.attributes.dirTag === 'string' ) ? o.attributes.dirTag.substring( 0, 3 ).replace( '_', ' ' ) : '';
                        }

                        o.attributes[ 'routeName' ] = routeName;

                        sortedPredictions.alsoAtStop.push( o );
                    }
                }

                if ( showDisclaimer ) {
                    if ( Array.isArray( sortedPredictions.predictions ) ) {
                        sortedPredictions.showFooterDisclaimer = true;
                    }
                }

            } );

            return sortedPredictions;
        },
        /**
         * Function that returns predictions sorted in ascending order by minutes until the bus arrives at a stop.
         *
         * @param obj This is the predictions object.
         *
         * @return The bus predictions object containing sorted predictions.
         **/
        sortPredictions: function ( obj ) {
            obj.sort( function ( a, b ) {

                //Test if a.attributes or b.attributes, and a.attributes.dirTag or b.attributes.dirTag exists first
                if ( typeof a.attributes === 'undefined' || typeof a.attributes.dirTag === 'undefined' || typeof a.attributes.minutes === 'undefined' ) {
                    return 1;
                }

                if ( typeof b.attributes === 'undefined' || typeof b.attributes.dirTag === 'undefined' || typeof b.attributes.minutes === 'undefined' ) {
                    return 0;
                }

                //Dirtag and minutes for a
                var aDirTag = parseInt( a.attributes.dirTag.substring( 0, a.attributes.dirTag.indexOf( '_' ) ) );
                var aMin = parseInt( a.attributes.minutes );

                //Dirtag and minutes for b
                var bDirTag = parseInt( b.attributes.dirTag.substring( 0, b.attributes.dirTag.indexOf( '_' ) ) );
                var bMin = parseInt( b.attributes.minutes );

                return ( aDirTag === bDirTag ) ? aMin - bMin : aDirTag - bDirTag;
            } );

            return obj;
        },
        /**
         *
         * Function that opens the bus route map.
         *
         **/
        showMap: function ( e ) {
            e.preventDefault();

            var mapURL = '/map/?a=' + app.defaults.agencyTag + '&r=' + app.defaults.routeNumber + '&d=' + app.defaults.directionVar + '&s=' + app.defaults.stopId
            window.open( mapURL );
        },
        clearCountdown: function () {
            //Clear any bus predictions
            this.$el.find( '.bus-stop-container .selected-route-container .bus-times .bus-time' ).each( function () {
                $( this ).remove();
            } );
        },
        clearTimer: function () {
            //Clear the refresh predictions timmer
            window.clearTimeout( app.settings.busCountdownTimer );
            app.settings.busCountdownTimer = 0;
        },
        close: function () {
            this.clearTimer();

            this.clearCountdown();

            this.$el.find( '.bus-stop-container .selected-route-container .disclaimer-text' ).hide();

            //Close also at this stop view
            if ( typeof app.activeViews.busAlsoAtStop === 'object' ) {
                app.activeViews.busAlsoAtStop.close();
                app.activeViews.busAlsoAtStop = {};
                delete app.activeViews.busAlsoAtStop;
            }

            //Hide the .bus-countdown container
            this.$el.hide();

            this.$el.unbind();
        }
    } );
} )();
