//Routes view
define( [
    "jquery",
    "chosen",
    "underscore",
    "backbone",
    "utility/general/utility",
    "utility/models/models",
    "text!templates/route/route.html"
], function ( $, chosen, _, Backbone, generalUtility, modelsUtility, routesTemplate ) {

    "use strict";

    var routesView = Backbone.View.extend( {
        el: ".routes-available",

        initialize: function () {
            this.listenTo( modelsUtility.routesCollection, "add", this.render );
        },

        render: function () {
            var route = Backbone.app.defaults.route;
            var routeModel = modelsUtility.routesCollection.models[ 0 ];
            var self = this;

            this.$routeSelect = $( "#route-select" );
            this.$routeSelect.trigger( "chosen:updated" );

            if ( this.$routeSelect.find( "option" ).length > 1 ) {
                this.$routeSelect.find( 'option:gt(0)' ).remove();
            }

            if ( typeof routeModel === "object" ) {
                if ( ( this.$routeSelect.find( "option" ).length <= 1 ) || ( this.$routeSelect.find( "option" ).length === 1 ) ) {
                    var data = {
                        route: routeModel.attributes.mode
                    }

                    data.route = _.filter( data.route, function ( item, key ) {
                        return item.mode_name.toLowerCase() === generalUtility.urlDecode( Backbone.app.defaults.mode );
                    } );

                    data.route = generalUtility.concatArray( data, "route" );

                    data.route = _.sortBy( data.route, function ( item, key ) {
                        if ( isNaN( item.route_name.substring( 0, 2 ) ) ) { //Sort by route name if route name is a word.
                            return item.route_name;
                        } else { //Sort by route id if route name is a number.
                            return item.route_id.length;
                        }
                    } );

                    var routeTemplate = _.template( routesTemplate );

                    this.$routeSelect.append( routeTemplate( data ) );
                }

                if ( Backbone.app.defaults.route !== null ) {
                    this.$routeSelect.val(
                        generalUtility.urlDecode( route )
                    ).trigger( "chosen:updated" );
                } else {
                    this.$routeSelect.val( "0" ).trigger( "chosen:updated" );
                }

                this.$routeSelect.chosen( {
                    no_results_text: "Nothing found.",
                    width: "25%"
                } );

                $( ".container main .content .route-info .routes-available" ).show();
            }
        },

        events: {
            "change #route-select": "showDirection"
        },

        /**
         * This will show the direction view when a route has been selected.
         * @param  {Object} e The event object of the route select box.
         */
        showDirection: function ( e ) {
            var mode = Backbone.app.defaults.mode;
            var route = this.$routeSelect.chosen().val();

            route = ( mode === "bus" ) ? route : generalUtility.urlEncode( route );

            Backbone.app.defaults.route = route;

            Backbone.app.router.navigate( "!/" + mode + "/" + route, {
                trigger: true
            } );
        },

        /**
         * Method will close the route view.
         */
        close: function () {
            if ( this.$routeSelect.length ) {
                this.$routeSelect.find( 'option:gt(0)' ).remove();
            }

            modelsUtility.routesCollection.reset();
            this.stopListening( modelsUtility.routesCollection );

            this.$el.unbind();
            this.$el.hide();

            Backbone.app.defaults.route = null;
        }
    } );

    return routesView;
} );
