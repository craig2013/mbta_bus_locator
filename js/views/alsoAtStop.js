//Also at stop bus route countdwn
define( [
    'jquery',
    'underscore',
    'backbone',
    'utility/getBusPredictions',
    'utility/sortRoutes',
    'utility/sortPredictions',
    'utility/getRouteName',
    'text!templates/bus-countdown/alsoAtStop.html'
], function ( $, _, Backbone, getPredictionsUtility, sortRoutesUtility,
    sortPredictionsUtility, getRouteNameUtility, alsoAtStopTemplate ) {

    var alsoAtStopCountdownView = Backbone.View.extend( {

        el: $( '.also-at-stop-container' ),

        initialize: function () {
            this.render();
        },

        render: function () {
            var alsoAtStopModel = this.model.models;

            if ( Array.isArray( alsoAtStopModel ) ) {
                if ( ( alsoAtStopModel.length === 1 ) && ( typeof alsoAtStopModel[ 0 ].attributes.dirTitleBecauseNoPredictions === 'string' ) ) {
                    this.$el.hide();
                } else {
                    var alsoAtStopView = _.template( alsoAtStopTemplate );
                    var busTimes = alsoAtStopModel;

                    var alsoAtStopData = {
                        'busTimes': [],
                        'routeInfo': []
                    };

                    if ( busTimes.length ) {

                        this.$el.html( '' );

                        alsoAtStopData.busTimes = busTimes;

                        alsoAtStopData.busTimes = sortPredictionsUtility.sortPredictions( alsoAtStopData.busTimes, 'sortByPrediction' );

                        this.$el.html( alsoAtStopView( alsoAtStopData ) );

                        this.$el.show();
                    }
                }
            }


            return this;
        },

        close: function () {

            this.model.unbind();

            this.stopListening();

            this.$el.find( '.bus-times' ).unbind();
            this.$el.find( '.bus-times' ).remove();

            //Hide the .also-at-stop container
            this.$el.hide();

        }
    } );

    return alsoAtStopCountdownView;
} );
