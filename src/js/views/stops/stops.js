//Stops view
"use strict";
var $ = require("jquery");
var chosen = require("jquery-chosen");
var _ = require("underscore");
var Backbone = require("backbone");
var Handlebars = require("handlebars");
var Defaults = require("../../defaults");
var generalUtility = require("../../utility/general/utility");
var modelsUtility = require("../../utility/models/models");
var stopsTemplate = require("../../templates/stop/stop.hbs");

Backbone.$ = $;

var stopsView = Backbone.View.extend( {
    el: ".route-stops",

    initialize: function () {
        this.listenTo( modelsUtility.stopsByDirectionCollection, "add", this.render );
    },

    render: function () {
        var data = {
            stops: []
        };
        var stop = Defaults.stop;
        var stopsModel = modelsUtility.stopsByDirectionCollection.models;

        this.$stopsSelect = $( "#stop-select" );

        this.$stopsSelect.trigger( "chosen:updated" );

        if ( this.$stopsSelect.find( "option" ).length > 1 ) {
            this.$stopsSelect.find( "option:gt(0)" ).remove();
        }

        if ( Array.isArray( stopsModel ) ) {
            if ( ( this.$stopsSelect.find( "option" ).length <= 1 ) || ( this.$stopsSelect.find( "option" ).length === 1 ) ) {
                var stopModelLength = stopsModel.length;

                for ( var i = 0; i < stopModelLength; i++ ) {
                    data.stops.push( stopsModel[ i ].attributes );
                }

                Handlebars.registerHelper("lowercase", function(item) {
                    return item.toLowerCase();
                });                      

                this.$stopsSelect.append( stopsTemplate( data ) );
            }

            if ( typeof stop === "string" ) {
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

    showCountDown: function () {
        var direction = Defaults.direction;
        var mode = Defaults.mode;
        var route = Defaults.route;
        var stop = generalUtility.urlEncode( this.$stopsSelect.chosen().val() );
        var stopName = this.$stopsSelect.find( "option:selected" ).attr( "data-stop-name" );

        Defaults.stop = stop;
        Defaults.stopName = stopName;

        Defaults.router.navigate( "!/" + mode + "/" + route + "/" + direction + "/" + stop, {
            trigger: true
        } );
    },

    close: function () {
        if ( this.$stopsSelect.length ) {
            this.$stopsSelect.find( "option:gt(0)" ).remove();
        }

        modelsUtility.stopsByDirectionCollection.reset();
        this.stopListening( modelsUtility.stopsByDirectionCollection );

        this.$el.unbind();
        this.$el.hide();

        Defaults.stop = null;
    }
} );

module.exports = stopsView;