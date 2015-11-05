//bus routes
define( [
    'jquery',
    'chosen',
    'underscore',
    'backbone',
    'models/busRoutes',
    'collections/busRoutes',
    'text!templates/bus-routes/busRoutes.html'
], function ( $, chosen, _, Backbone, busRoutesModel, busRoutesCollection, routesTemplate ) {

    var routesView = Backbone.View.extend( {
        el: '.routesAvailable',

        initialize: function () {
            busRoutesCollection.fetch( {
                traditional: true,
                data: {
                    'command': 'routeList',
                    'agency': Backbone.app.defaults.agencyTag
                }
            } );

            this.listenTo( busRoutesCollection, 'sync', this.render );
        },

        render: function () {
            var routeModel = busRoutesCollection.models[ 0 ];
            var self = this;
            this.$route_select = $( '#route_select' );

            this.$route_select.trigger( 'chosen:updated' );

            if ( typeof routeModel === 'object' ) {
                if ( this.$route_select.find( 'option' ).length <= 1 ) {
                    var data = {
                        'route': routeModel.attributes.route
                    };

                    var routeTemplate = _.template( routesTemplate );
                    this.$route_select.append( routeTemplate( data ) );
                }

                if ( !isNaN( Backbone.app.defaults.routeNumber ) ) {
                    this.$route_select.val( Backbone.app.defaults.routeNumber );
                }

                $( '#route_select' ).chosen( {
                    no_results_text: 'Nothing found.',
                    width: '60%'
                } );

                $( '.container main .loading' ).hide();
                $( '.container main .content, .container main .content .routeInfo .routesAvailable' ).show();
            }

        },

        events: {
            'change #route_select': 'showDirections'
        },

        showDirections: function ( e ) {
            var routeNumber = $( '#route_select' ).chosen().val();

            if ( !isNaN( routeNumber ) ) {
                Backbone.app.defaults.routeNumber = routeNumber;
                Backbone.app.router.navigate( 'route/' + routeNumber, {
                    trigger: true
                } );
            }

            return false;
        },

        close: function () {
            this.$el.unbind();
        }
    } );

    return routesView;
} );
