//Stops view
define( [
    "jquery",
    "chosen",
    "underscore",
    "backbone",
    "utility/general/utility",
    "utility/models/models",
    "text!templates/stop/stop.html"
], function ( $, chosen, _, Backbone, generalUtility, modelsUtility, stopsTemplate ) {

    "use strict";

    var stopsView = Backbone.View.extend( {
        el: ".route-stops",

        initialize: function () {
            this.listenTo( modelsUtility.stopsCollection, "add", this.render );
        },

        render: function () {
            var data = {
                stops: []
            };            
            var direction = Backbone.app.defaults.direction;
            var mode = Backbone.app.defaults.mode;
            var route =Backbone.app.defaults.route;
            var stop = Backbone.app.defaults.stop;
            var stopModel = {};
            var stopsModel = modelsUtility.stopsCollection.models;
            var stopTemplate = {};
            var self = this;

            this.$stopsSelect = $( "#stop-select" );

            this.$stopsSelect.trigger( "chosen:updated" );

            if ( this.$stopsSelect.find( "option" ).length > 1 ) {
                this.$stopsSelect.find( 'option:gt(0)' ).remove();
            }

            if ( typeof stopsModel === "object" ) {
                if ( ( this.$stopsSelect.find( "option" ).length <= 1 ) || ( this.$stopsSelect.find( "option" ).length === 1 ) ) {

                    if ( mode === "subway" && route === "green-b" || route === "green-c" || route === "green-d" || route === "green-e" ) {
                        stopsModel = modelsUtility.stopsCollection.models;

                        for ( var i = 0; i < stopsModel.length; i++ ) {
                            data.stops.push(stopsModel[i].attributes);
                        }

                    } else {
                        stopsModel = stopsModel[ 0 ];
                        stopModel = stopsModel.attributes.direction;

                        if ( typeof stopModel !== "undefined" ) {
                            for ( var i = 0; i < stopModel.length; i++ ) {
                                if ( stopModel[ i ].direction_name.toLowerCase() === direction.toLowerCase() ) {
                                    data.stops = stopModel[ i ].stop;
                                }
                            }
                        }

                    }                 

                    stopTemplate = _.template( stopsTemplate );

                    this.$stopsSelect.append( stopTemplate( data ) );
                }

                if ( Backbone.app.defaults.stop !== null ) {
                    this.$stopsSelect.val(
                        generalUtility.urlDecode( stop )
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

            return this;
        },

        events: {
            "change #stop-select": "showCountDown"
        },

        showCountDown: function ( e ) {
            var direction = Backbone.app.defaults.direction;
            var mode = Backbone.app.defaults.mode;
            var route = Backbone.app.defaults.route;
            var stop = generalUtility.urlEncode( this.$stopsSelect.chosen().val() );
            var stopName = this.$stopsSelect.find( "option:selected" ).attr( "data-stop-name" );

            Backbone.app.defaults.stop = stop;
            Backbone.app.defaults.stopName = stopName;

            Backbone.app.router.navigate( "!/" + mode + "/" + route + "/" + direction + "/" + stop, {
                trigger: true
            } )
        },

        close: function () {
            if ( this.$stopsSelect.length ) {
                this.$stopsSelect.find( 'option:gt(0)' ).remove();
            }

            modelsUtility.stopsCollection.reset();
            this.stopListening( modelsUtility.stopsCollection );

            this.$el.unbind();
            this.$el.hide();

            Backbone.app.defaults.stop = null;
        }
    } );

    return stopsView;
} );
