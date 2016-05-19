//Predictions view
define( [
    "jquery",
    "chosen",
    "underscore",
    "backbone",
    "utility/general/utility",
    "models/predictions/predictions",
    "collections/predictions/predictions",
    "text!templates/predictions/boat/boat.html",
    "text!templates/predictions/bus/bus.html",
    "text!templates/predictions/commuter-rail/commuter-rail.html",
    "text!templates/predictions/subway/subway.html"
], function ( $, chosen, _, Backbone, generalUtility,
    predictionsModel, predictionsCollection,
    boatTemplate, busTemplate, commuterRailTemplate, subwayTemplate ) {

    "use strict";

    var predictionsView = Backbone.View.extend( {
        el: ".predictions-container",

        initialize: function () {
            clearTimeout( Backbone.app.defaultSettings.predictionsTimer );
            Backbone.app.defaultSettings.predictionsTimer = null;

            this.fetchPredictions();

            this.listenTo( predictionsCollection, "sync", this.render );
        },

        render: function () {
            var data = {
                predictions: null,
                alert: null
            };
            var mode = generalUtility.urlDecode( Backbone.app.defaults.mode );
            var predictionsModel = predictionsCollection.models[ 0 ];
            var routeText = $( "#route_select_chosen .chosen-single" ).text();
            var self = this;
            var showMapLink = true;
            var template = null;

            if ( typeof predictionsModel === "object" ) {
                if ( typeof predictionsModel.attributes.mode !== "undefined" ) {
                    var predictionModel = predictionsModel.attributes.mode[ 0 ].route;

                    //predictionModel = ( Backbone.app.defaults.mode === "bus" ) ? generalUtility.sortPredictions( predictionModel, routeText ) : predictionModel;
                    if ( Backbone.app.defaults.mode === "bus" ) {
                        predictionModel = generalUtility.sortPredictions( predictionModel, routeText );
                    } 

                    Backbone.app.defaults.routeText = routeText;

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
                        showMapLink = false;
                    }
                }

                switch ( mode ) {
                case "boat":
                    template = _.template( boatTemplate );
                    break
                case "bus":
                    template = _.template( busTemplate );
                    break;
                case "commuter rail":
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

                    if ( !showMapLink ) {
                        this.$el.find( ".show-map-link" ).hide();
                    }

                    $( ".container main .content .predictions-container" ).show();
                }

            }

            return this;
        },

        events: {
            "click .show-map-link": "showMap",
            "click .hide-map-link": "hideMap"
        },

        showMap: function ( e ) {
            e.preventDefault();
            var mode = Backbone.app.defaults.mode;
            var route = Backbone.app.defaults.route;
            var direction = Backbone.app.defaults.direction;
            var stop = Backbone.app.defaults.stop;

            this.$el.find( ".hide-map-link" ).css( {
                display: "block"
            } );
            this.$el.find( ".show-map-link" ).hide();

            Backbone.app.router.navigate( "mode/" + mode + "/route/" + route + "/direction/" + direction + "/stop/" + stop + "/map", {
                trigger: true
            } );
        },

        hideMap: function ( e ) {
            e.preventDefault();
            var mode = Backbone.app.defaults.mode;
            var route = Backbone.app.defaults.route;
            var direction = Backbone.app.defaults.direction;
            var stop = Backbone.app.defaults.stop;

            this.$el.find( ".hide-map-link" ).hide();
            this.$el.find( ".show-map-link" ).css( {
                display: "block"
            } );

            Backbone.app.router.navigate( "mode/" + mode + "/route/" + route + "/direction/" + direction + "/stop/" + stop, {
                trigger: true
            } );
        },

        fetchPredictions: function () {
            var self = this;
            var stop = generalUtility.titleCase(
                encodeURIComponent(
                    generalUtility.urlDecode( Backbone.app.defaults.stop )
                )
            );

            predictionsCollection.fetch( {
                reset: true,
                data: {
                    "queryType": "predictionsbystop",
                    "queryString": "stop",
                    "queryValue": stop
                }
            } );

            Backbone.app.defaultSettings.predictionsTimer = setTimeout( function () {
                self.fetchPredictions();
            }, Backbone.app.defaultSettings.refreshPredictionsTime );
        },

        close: function () {
            clearTimeout( Backbone.app.defaultSettings.predictionsTimer );
            Backbone.app.defaultSettings.predictionsTimer = null;

            predictionsCollection.reset();
            this.stopListening( predictionsCollection );

            this.$el.unbind();
            this.$el.hide();
        }
    } );

    return predictionsView;
} );
