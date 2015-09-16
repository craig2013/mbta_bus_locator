var app = app || {};

( function () {
    'use strict';

    app.views.busRouteDirections = Backbone.View.extend( {

        el: '.routeDirection',

        initialize: function () {
            app.collections.busRouteDirections.fetch( {
                traditional: true,
                data: {
                    'command': 'direction',
                    'agency': app.defaults.agencyTag,
                    'route': app.defaults.routeNumber
                }
            } );

            this.listenTo( app.collections.busRouteDirections, 'add', this.render );

            this.template = _.template( $( '#tpl-route-direction' ).html() );
        },

        render: function ( e ) {
            var directionItems = {};
            var busDirectionModel = this.model;

            directionItems = this.getBusDirections( busDirectionModel );

            //Sort directions in ascending order
            directionItems.sort( function ( a, b ) {
                if ( a.title < b.title ) {
                    return -1;
                }

                if ( a.title > b.title ) {
                    return 1;
                }

                return 0;
            } );

            this.$direction_select = $( '#direction_select' );

            this.$direction_select.trigger( 'chosen:updated' );

            this.$direction_select.find( 'option:gt(0)' ).remove();

            var directionTemplate = this.template( {
                'directionItems': directionItems
            } );

            this.$direction_select.append( directionTemplate );

            if ( ( isNaN( app.defaults.directionVar ) && app.defaults.directionVar.length ) ) {
                this.$direction_select.val( app.defaults.directionVar );

                if ( app.defaults.directionText === 0 ) {
                    app.defaults.directionText = this.$direction_select.find( 'option:selected' ).text();
                }


            } else {
                this.$direction_select.val( 0 );
            }


            $( '#direction_select' ).chosen( {
                no_results_text: 'Nothing found.',
                width: '60%'
            } );



            $( '.container main .content .routeInfo .routeDirection' ).show();

        },

        events: {
            'change #direction_select': 'showDirectionStops'
        },

        /**
         * Function that returns directions available for a selected stop.
         *
         * @param obj This is the predictions object.
         *
         * @return The directions for a selected stop.
         */
        getBusDirections: function ( obj ) {
            return ( typeof obj === 'object' ) ? obj.pluck( 'attributes' ) : 'No directions found';
        },

        showDirectionStops: function ( e ) {
            if ( this.$direction_select.val() ) {
                app.defaults.directionVar = this.$direction_select.val();
                app.defaults.directionText = this.$direction_select.find( 'option:selected' ).text();
                app.router.navigate( 'route/' + app.defaults.routeNumber + '/direction/' + encodeURIComponent( app.defaults.directionVar ), {
                    trigger: true
                } );
            }

            return false;
        },

        close: function () {
            if ( this.$direction_select.length ) {
                this.$direction_select.find( 'option:gt(0)' ).remove();
            }

            $( '.container main .content .routeInfo .routeDirection' ).hide();

            this.$el.unbind();

            app.defaults.directionText = 0;
            app.defaults.directionVar = 0;
        }
    } );
} )();
