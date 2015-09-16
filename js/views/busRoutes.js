var app = app || {};

( function () {
    'use strict';

    app.views.busRoutes = Backbone.View.extend( {

        el: '.routesAvailable',

        initialize: function () {
            app.collections.busRoutes.fetch( {
                traditional: true,
                data: {
                    'command': 'routeList',
                    'agency': app.defaults.agencyTag
                }
            } );
            this.listenTo( app.collections.busRoutes, 'all', this.render );

            this.template = _.template( $( '#tpl-routes' ).html() );
        },

        render: function ( e ) {
            var routeModel = this.model.models[ 0 ];
            var self = this;
            this.$route_select = $( '#route_select' );

            this.$route_select.trigger( 'chosen:updated' );

            if ( typeof routeModel === 'object' ) {
                if ( this.$route_select.find( 'option' ).length <= 1 ) {

                    var routeTemplate = this.template( routeModel.toJSON() );
                    this.$route_select.append( routeTemplate );

                }



                if ( !isNaN( app.defaults.routeNumber ) ) {
                    this.$route_select.val( app.defaults.routeNumber );
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
                app.defaults.routeNumber = routeNumber;
                app.router.navigate( 'route/' + app.defaults.routeNumber, {
                    trigger: true
                } );
            }

            return false;
        },

        close: function () {
            this.$el.unbind();
        }
    } );
} )();
