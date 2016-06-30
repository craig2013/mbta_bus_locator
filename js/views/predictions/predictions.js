//Predictions view
define( [
    "jquery",
    "chosen",
    "underscore",
    "backbone",
    "utility/general/utility",
    "utility/predictions/predictions",
    "utility/models/models",
    "text!templates/predictions/boat/boat.html",
    "text!templates/predictions/bus/bus.html",
    "text!templates/predictions/commuter-rail/commuter-rail.html",
    "text!templates/predictions/subway/subway.html"
], function ( $, chosen, _, Backbone, generalUtility, predictionsUtility, modelUtility,
    boatTemplate, busTemplate, commuterRailTemplate, subwayTemplate ) {

    "use strict";

    var predictionsView = Backbone.View.extend( {
        el: ".predictions-container",

        initialize: function ( options ) {
            var self = this;
            this.options = options;

            this.listenTo( modelUtility.predictionsCollection, "sync", this.render );
        },

        render: function () {
            var predictionsModel = modelUtility.predictionsCollection.models[ 0 ];
            var self = this;

            if ( typeof predictionsModel === "object" ) {
                if ( typeof predictionsModel.attributes.mode !== "undefined" ) {

                    var data = {
                        predictions: null,
                        alert: null
                    };
                    var predictionModel = {};
                    var routeText = $( "#route_select_chosen .chosen-single" ).text();
                    var template = null;

                    this.direction = Backbone.app.defaults.direction;
                    this.mode = Backbone.app.defaults.mode;
                    this.route = Backbone.app.defaults.route;
                    this.stop = Backbone.app.defaults.stop;

                    predictionModel = predictionsUtility.getPredictionsByStop( predictionsModel.attributes.mode[ 0 ].route );


                    data.predictions = predictionModel;

                    _.extend( data, generalUtility, Backbone.app.defaults );

                    if ( predictionsModel.attributes.alert_headers.length >= 1 ) {
                        data.alert = predictionsModel.attributes.alert_headers[ 0 ].header_text;
                    }
                } else if ( typeof predictionsModel.attributes.alert_headers !== "undefined" ) {
                    if ( predictionsModel.attributes.alert_headers.length >= 1 ) {
                        data.alert = predictionsModel.attributes.alert_headers[ 0 ].header_text;
                    } else {
                        data.alert = "Currently no predictions available.";
                    }
                }

                switch ( this.mode ) {
                case "boat":
                    template = _.template( boatTemplate );
                    break
                case "bus":
                    template = _.template( busTemplate );
                    break;
                case "commuter+rail":
                    template = _.template( commuterRailTemplate );
                    break;
                case "subway":
                    template = _.template( subwayTemplate );
                    break;
                default:
                    alert( "No template found.  Please try a  different mode." );
                    break;
                }


                if ( template !== null ) {
                    this.$el.html( template( data ) );

                    if ( Backbone.app.defaults.showMap ) {
                        this.$el.find( ".hide-map-link" ).css( {
                            display: "block"
                        } );
                        this.$el.find( ".show-map-link" ).hide();
                    } else {
                        this.$el.find( ".hide-map-link" ).hide();
                        this.$el.find( ".show-map-link" ).css( {
                            display: "block"
                        } );
                    }

                    $( ".container main .content .predictions-container" ).show();
                }

            }

            // Fetch new predictions if map is not being shown.
            if ( !( Backbone.app.defaults.showMap ) ) {
                predictionsUtility.fetchNewPredictions( modelUtility, this.options );
            }


            return this;
        },

        events: {
            "click .show-map-link": "showMap",
            "click .hide-map-link": "hideMap"
        },

        showMap: function ( e ) {
            e.preventDefault();

            clearTimeout( Backbone.app.defaults.timer );
            Backbone.app.defaults.timer = null;

            Backbone.app.defaults.showMap = true;

            Backbone.app.router.navigate( "!/" + this.mode + "/" + this.route + "/" + this.direction + "/" + this.stop + "/show-map", {
                trigger: true
            } );
        },

        hideMap: function ( e ) {
            e.preventDefault();

            clearTimeout( Backbone.app.defaults.timer );
            Backbone.app.defaults.timer = null;

            Backbone.app.defaults.showMap = false;

            Backbone.app.router.navigate( "!/" + this.mode + "/" + this.route + "/" + this.direction + "/" + this.stop, {
                trigger: true
            } );
        },

        close: function () {
            clearTimeout( Backbone.app.defaults.timers );
            Backbone.app.defaults.timers = null;

            modelUtility.predictionsCollection.reset();
            this.stopListening( modelUtility.predictionsCollection );

            this.$el.unbind();
            this.$el.hide();
        }
    } );

    return predictionsView;
} );
