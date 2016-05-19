//Direction view
define( [
    "jquery",
    "chosen",
    "underscore",
    "backbone",
    "utility/general/utility",
    "models/stops/stops",
    "collections/stops/stops",
    "text!templates/direction/direction.html"
], function ( $, chosen, _, Backbone, generalUtility, stopsModel, stopsCollection, directionsTemplate ) {

    "use strict";

    var directionView = Backbone.View.extend( {
        el: ".route-direction",

        initialize: function () {
            stopsCollection.fetch( {
                reset: true,
                data: {
                    "queryType": "stopsbyroute",
                    "queryString": "route",
                    "queryValue": Backbone.app.defaults.route
                }
            } );

            this.listenTo( stopsCollection, "sync", this.render );
        },

        render: function () {
            var stopModel = stopsCollection.models[ 0 ];
            var self = this;

            this.$directionSelect = $( "#direction-select" );

            this.$directionSelect.trigger( "chosen:updated" );

            if ( typeof stopModel === "object" ) {
                if ( this.$directionSelect.find( "option" ).length <= 1 ) {

                    var data = {
                        direction: []
                    };
                    var directionModel = stopModel.attributes.direction;

                    if ( typeof directionModel !== "undefined" ) {
                        for ( var i = 0; i < directionModel.length; i++ ) {
                            if ( Backbone.app.defaults.modeType === "bus" ) {
                                data.direction.push( {
                                    text: directionModel[ i ].direction_name + " - " + directionModel[ i ].stop.pop().stop_name,
                                    value: directionModel[ i ].direction_name
                                } );
                            } else {
                                data.direction.push( {
                                    text: null,
                                    value: directionModel[ i ].direction_name
                                } );
                            }

                        }
                    }

                    var directionTemplate = _.template( directionsTemplate );

                    this.$directionSelect.append( directionTemplate( data ) );
                }

                if ( Backbone.app.defaults.direction !== null ) {
                    this.$directionSelect.val(
                        generalUtility.urlDecode(
                            Backbone.app.defaults.direction
                        )
                    ).trigger( "chosen:updated" );
                } else {
                    this.$directionSelect.val( "0" ).trigger( "chosen:updated" );
                }

                this.$directionSelect.chosen( {
                    no_results_text: "Nothing found.",
                    width: "25%"
                } );

                $( ".container main .content .route-info .route-direction" ).show();
            }
        },

        events: {
            "change #direction-select": "showStops"
        },

        showStops: function ( e ) {
            var direction = $( "#direction-select" ).chosen().val();

            direction = generalUtility.urlEncode( direction );

            Backbone.app.defaults.direction = direction;

            Backbone.app.router.navigate( "mode/" + Backbone.app.defaults.mode + "/route/" + Backbone.app.defaults.route + "/direction/" + direction, {
                trigger: true
            } );
        },

        close: function () {
            if ( this.$directionSelect.length ) {
                this.$directionSelect.find( 'option:gt(0)' ).remove();
            }

            stopsCollection.reset();
            this.stopListening( stopsCollection );

            this.$el.unbind();
            this.$el.hide();

            Backbone.app.defaults.direction = null;
        }
    } );

    return directionView;
} );
