//Direction view
define( [
    "jquery",
    "chosen",
    "underscore",
    "backbone",
    "utility/general/utility",
    "utility/models/models",
    "text!templates/direction/direction.html"
], function ( $, chosen, _, Backbone, generalUtility, modelsUtility, directionsTemplate ) {

    "use strict";

    var directionView = Backbone.View.extend( {
        el: ".route-direction",

        initialize: function () {

            this.listenTo( modelsUtility.directionCollection, "sync", this.render );
        },

        render: function () {
            var direction = Backbone.app.defaults.direction;
            var directionModel = modelsUtility.directionCollection.models;
            var self = this;

            this.$directionSelect = $( "#direction-select" );

            this.$directionSelect.trigger( "chosen:updated" );

            if ( this.$directionSelect.find( "option" ).length > 1 ) {
                this.$directionSelect.find( 'option:gt(0)' ).remove();
            }

            if ( Array.isArray( directionModel ) ) {
                if ( this.$directionSelect.find( "option" ).length <= 1 ) {

                    var data = {
                        direction: []
                    };

                    for ( var i = 0; i < directionModel.length; i++ ) {
                        data.direction.push( {
                            text: directionModel[ i ].attributes.direction_name
                        } );
                    }

                    var directionTemplate = _.template( directionsTemplate );

                    this.$directionSelect.append( directionTemplate( data ) );
                }

                if ( Backbone.app.defaults.direction !== null ) {
                    this.$directionSelect.val(
                        generalUtility.urlDecode( direction )
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
            var mode = Backbone.app.defaults.mode;
            var route = Backbone.app.defaults.route;

            direction = generalUtility.urlEncode( direction );

            Backbone.app.defaults.direction = direction;

            Backbone.app.router.navigate( "!/" + Backbone.app.defaults.mode + "/" + Backbone.app.defaults.route + "/" + direction, {
                trigger: true
            } );
        },

        close: function () {
            if ( this.$directionSelect.length ) {
                this.$directionSelect.find( 'option:gt(0)' ).remove();
            }

            modelsUtility.directionCollection.reset();
            this.stopListening( modelsUtility.directionCollection );

            this.$el.unbind();
            this.$el.hide();

            Backbone.app.defaults.direction = null;
        }
    } );

    return directionView;
} );
