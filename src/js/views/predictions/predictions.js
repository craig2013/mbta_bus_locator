//Predictions view
"use strict";
var $ = require("jquery");
var _ = require("underscore");
var Backbone = require("backbone");
var Handlebars = require("hbsfy/runtime");
var Defaults = require("../../defaults");
var generalUtility = require("../../utility/general/utility");
var modelUtility = require("../../utility/models/models");
var predictionsUtility = require("../../utility/predictions/predictions");
var busTemplate = require("../../templates/predictions/bus/bus.hbs");
var commuterRailTemplate = require("../../templates/predictions/commuter-rail/commuter-rail.hbs");
var subwayTemplate = require("../../templates/predictions/subway/subway.hbs");

var predictionsView = Backbone.View.extend( {
    el: ".predictions-container",

    initialize: function ( options ) {
        this.options = options;

        this.listenTo( modelUtility.predictionsCollection, "sync", this.render );
    },

    render: function () {
        var data = {
            predictions: null,
            alert: null
        };
        var predictionsModel = modelUtility.predictionsCollection.models[ 0 ];

        this.direction = Defaults.direction;
        this.mode = Defaults.mode;
        this.route = Defaults.route;
        this.stop = Defaults.stop;

        if ( typeof predictionsModel === "object" ) {
            if ( typeof predictionsModel.attributes === "object" ) {
                if ( Array.isArray(predictionsModel.attributes.mode) ) {
                    var predictionModel = {};

                    predictionModel = predictionsUtility.getPredictionsByStop( predictionsModel.attributes.mode[ 0 ].route );


                    data.predictions = predictionModel;



                    _.extend( data, generalUtility, this.options.stopName );

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
            }
            
            Handlebars.registerHelper("convertTime", function(time) {
                return (generalUtility.convertTime(time) >= 1) ? generalUtility.convertTime(time) + " min" : "Arriving";
            });     

            switch(this.mode) {
            case "bus":
                this.$el.html( busTemplate( data ) );
                break;
            case "commuter+rail":
                this.$el.html( commuterRailTemplate( data ) );
                break;               
            case "subway":
                this.$el.html( subwayTemplate( data ) );
                break;
            default:
                alert( "No template found.  Please try a  different mode." );
                break;                
            }

            if ( Defaults.mapLoaded ) {
                $(".btn-map-show").hide();
                $(".btn-map-hide").show();                
            }        

            $( ".container main .content .predictions-container" ).show();
        }

        //Fetch new predictions if map is not being shown.
        if ( !( Defaults.showMap ) ) {
            predictionsUtility.fetchNewPredictions( modelUtility /*, this.options */ );
        }

        return this;
    },

    events: {
        "click .btn-map-show": "showMap",
        "click .btn-map-hide": "hideMap"
    },

    showMap: function ( e ) {
        e.preventDefault();

        clearTimeout( Defaults.timer );
        Defaults.timer = null;

        Defaults.showMap = true;

        Defaults.router.navigate( "!/" + this.mode + "/" + this.route + "/" + this.direction + "/" + this.stop + "/show-map", {
            trigger: true
        } );
    },

    hideMap: function ( e ) {
        e.preventDefault();

        clearTimeout( Defaults.timer );
        Defaults.timer = null;

        Defaults.showMap = false;

        Defaults.router.navigate( "!/" + this.mode + "/" + this.route + "/" + this.direction + "/" + this.stop, {
            trigger: true
        } );
    },

    close: function () {
        clearTimeout( Defaults.timers );
        Defaults.timers = null;

        modelUtility.predictionsCollection.reset();
        this.stopListening( modelUtility.predictionsCollection );

        this.$el.unbind();
        this.$el.hide();
    }
} );

module.exports = predictionsView;