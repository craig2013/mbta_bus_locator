//Routes view
define( [
    "jquery",
    "chosen",
    "underscore",
    "backbone",
    "utility/general/utility",
    "models/stops/stops",
    "collections/stops/stops",
    "text!templates/stop/stop.html"
], function ( $, chosen, _, Backbone, generalUtility, stopsModel, stopsCollection, stopsTemplate ) {

    "use strict";

    var stopsView = Backbone.View.extend( {
        el: ".route-stops",

        initialize: function () {
            stopsCollection.fetch( {
                reset: true,
                data: {
                    "queryType": "stopsbyroute",
                    "queryString": "route",
                    "queryValue": generalUtility.urlDecode( Backbone.app.defaults.route )
                }
            } );

            this.listenTo( stopsCollection, "sync", this.render );
        },

        render: function () {
            var stopsModel = stopsCollection.models[ 0 ];
            var self = this;

            this.$stopsSelect = $( "#stop-select" );

            this.$stopsSelect.trigger( "chosen:updated" );

            if ( typeof stopsModel === "object" ) {
                if ( this.$stopsSelect.find( "option" ).length <= 1 ) {

                    var data = {
                        stops: []
                    };
                    var stopModel = stopsModel.attributes.direction;

                    if ( typeof stopModel !== "undefined" ) {
                        for ( var i = 0; i < stopModel.length; i++ ) {
                            if ( stopModel[ i ].direction_name.toLowerCase() === Backbone.app.defaults.direction.toLowerCase() ) {
                                data.stops = stopModel[ i ].stop;
                            }
                        }
                    }

                    var stopTemplate = _.template( stopsTemplate );

                    this.$stopsSelect.append( stopTemplate( data ) );
                }

                if ( Backbone.app.defaults.stop !== null ) {                  
                    this.$stopsSelect.val(
                            generalUtility.urlDecode( Backbone.app.defaults.stop )
                    ).trigger( "chosen:updated" );
                } else {
                    this.$stopsSelect.val( "0" ).trigger( "chosen:updated" );
                }

                this.$stopsSelect.chosen( {
                    search_contains: true,
                    no_results_text: "Nothing found.",
                    width: "25%"
                } );

                $( ".container main .content .route-info .route-stops" ).show();
            }
        },

        events: {
            "change #stop-select": "showCountDown"
        },

        showCountDown: function ( e ) {
            var direction = Backbone.app.defaults.direction;
            var mode = Backbone.app.defaults.mode;
            var route = Backbone.app.defaults.route;
            var stop = generalUtility.urlEncode( $( "#stop-select" ).chosen().val() );

            console.log("direction: " + direction);
            console.log("mode: " + mode);
            console.log("route: " + route);
            console.log("stop: " + stop);

            Backbone.app.defaults.stop = stop;



            Backbone.app.router.navigate( "mode/" + Backbone.app.defaults.mode + "/route/" + Backbone.app.defaults.route + "/direction/" + Backbone.app.defaults.direction + "/stop/" + stop, {
                trigger: true
            } )
        },

        close: function () {
            if ( this.$stopsSelect.length ) {
                this.$stopsSelect.find( 'option:gt(0)' ).remove();
            }

            stopsCollection.reset();
            this.stopListening( stopsCollection );

            this.$el.unbind();
            this.$el.hide();

            Backbone.app.defaults.stop = null;
        }
    } );

    return stopsView;
} );
