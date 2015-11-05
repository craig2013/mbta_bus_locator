//bus route directions
define( [
    'jquery',
    'chosen',
    'underscore',
    'backbone',
    'models/busRouteDirections',
    'collections/busRouteDirections',
    'utility/getBusDirections',
    'text!templates/bus-directions/busDirections.html'
], function ( $, chosen, _, Backbone, busRouteDirectionsModel, busRouteDirectionsCollection, getBusDirectionsUtility, directionsTemplate ) {

    var directionView = Backbone.View.extend( {
        el: '.routeDirection',

        initialize: function () {
            busRouteDirectionsCollection.fetch( {
                traditional: true,
                data: {
                    'command': 'direction',
                    'agency': Backbone.app.defaults.agencyTag,
                    'route': Backbone.app.defaults.routeNumber
                }
            } );

            this.listenTo( busRouteDirectionsCollection, 'sync', this.render );
        },

        render: function () {
            var directionItems = {};
            var directionModel = busRouteDirectionsCollection;
            var self = this;
            this.$direction_select = $( '#direction_select' );

            this.$direction_select.trigger( 'chosen:updated' );
            this.$direction_select.find( 'option:gt(0)' ).remove();

            directionItems = getBusDirectionsUtility.getBusDirections( directionModel );

            if ( ( Array.isArray( directionItems ) ) && ( directionItems.length >= 1 ) ) {
                if ( this.$direction_select.find( 'option' ).length <= 1 ) {
                    var data = {
                        'directionItems': directionItems
                    };

                    var directionTemplate = _.template( directionsTemplate );
                    self.$direction_select.append( directionTemplate( data ) );
                }

                if ( Backbone.app.defaults.directionVar.length >= 1 ) {
                    this.$direction_select.val( Backbone.app.defaults.directionVar );
                }

                $( '#direction_select' ).chosen( {
                    no_results_text: 'Nothing found.',
                    width: '60%'
                } );

                $( '.container main .content .routeInfo .routeDirection' ).show();
            }
        },

        events: {
            'change #direction_select': 'showDirectionStops'
        },

        showDirectionStops: function () {
            if ( this.$direction_select.val() ) {
                Backbone.app.defaults.directionVar = this.$direction_select.val();
                Backbone.app.defaults.directionText = this.$direction_select.find( 'option:selected' ).text();
                Backbone.app.router.navigate( 'route/' + Backbone.app.defaults.routeNumber + '/direction/' + encodeURIComponent( Backbone.app.defaults.directionVar ), {
                    trigger: true
                } );
            }
        },

        close: function () {
            if ( this.$direction_select.length ) {
                this.$direction_select.find( 'option:gt(0)' ).remove();
            }

            $( '.container main .content .routeInfo .routeDirection' ).hide();

            this.$el.unbind();

            Backbone.app.defaults.directionText = 0;
            Backbone.app.defaults.directionVar = 0;
        }
    } );

    return directionView;
} );
