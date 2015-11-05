define( [
    'jquery',
    'chosen',
    'underscore',
    'backbone',
    'models/busRouteStops',
    'collections/busRouteStops',
    'utility/getBusRouteStops',
    'text!templates/bus-stops/busRouteStops.html'
], function ( $, chosen, _, Backbone, busRouteStopsModel, busRouteStopsCollection, getBusRouteStopsUtility, routeStopsTemplate ) {

    var stopsView = Backbone.View.extend( {

        el: '.routeStops',

        initialize: function () {
            busRouteStopsCollection.fetch( {
                traditional: true,
                data: {
                    'command': 'directionStops',
                    'agency': Backbone.app.defaults.agencyTag,
                    'route': Backbone.app.defaults.routeNumber,
                    'direction': Backbone.app.defaults.directionVar
                }
            } );

            this.listenTo( busRouteStopsCollection, 'sync', this.render );
        },

        render: function () {
            var self = this;
            var busRouteStops = {};
            var busRouteStopModel = this.model;

            if ( typeof busRouteStopModel === 'object' && busRouteStopModel.models[ 0 ] !== undefined ) {

                busRouteStops = getBusRouteStopsUtility.getBusRouteStops( busRouteStopModel );

                this.$stop_select = $( '#stop_select' );

                this.$stop_select.trigger( 'chosen:updated' );

                if ( ( Array.isArray( busRouteStops.stops ) ) && ( busRouteStops.stops.length >= 1 ) ) {
                    this.$stop_select.find( 'option:gt(0)' ).remove();

                    busRouteStops = _.sortBy( busRouteStops.stops, 'title' );
                    busRouteStops = _.without( busRouteStops, 'undefined' );

                    var data = {
                        'stopItems': busRouteStops
                    };

                    var stopsTemplate = _.template( routeStopsTemplate );
                    this.$stop_select.append( stopsTemplate( data ) );

                    if ( !isNaN( Backbone.app.defaults.stopId ) ) {
                        this.$stop_select.val( Backbone.app.defaults.stopId );

                        Backbone.app.defaults.stopId = this.$stop_select.find( 'option:selected' ).attr( 'data-stopId' );
                        Backbone.app.defaults.stopTag = this.$stop_select.val();
                    }

                    $( '#stop_select' ).chosen( {
                        no_results_text: 'Nothing found.',
                        width: '60%'
                    } );

                    $( '.container main .content .routeInfo .routeStops' ).show();
                }
            }
        },

        events: {
            'change #stop_select': 'showArivalTime'
        },

        /**
         *
         * Function to show the bus arival time based on the stop selected.
         *
         **/
        showArivalTime: function () {
            if ( this.$stop_select.val() ) {
                Backbone.app.defaults.stopTag = this.$stop_select.val();
                Backbone.app.defaults.stopId = this.$stop_select.find( 'option:selected' ).attr( 'data-stopId' );
                Backbone.app.router.navigate( 'route/' + Backbone.app.defaults.routeNumber + '/' + 'direction' + '/' + encodeURIComponent( Backbone.app.defaults.directionVar ) + '/' + 'stop' + '/' + Backbone.app.defaults.stopTag, {
                    trigger: true
                } );
            }
            return false;
        },

        close: function () {
            if ( this.$stop_select.length ) {
                this.$stop_select.find( 'option:gt(0)' ).remove();
            }

            this.$el.hide();
            this.$el.unbind();

            Backbone.app.defaults.stopId = 0;
            Backbone.app.defaults.stopTag = 0;
        }
    } );

    return stopsView;
} );
