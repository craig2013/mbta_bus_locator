//Direction view
"use strict";
var $ = require("jquery");
var chosen = require("jquery-chosen");
var _ = require("underscore");
var Backbone = require("backbone");
var Handlebars = require("handlebars");
var Defaults = require("../../defaults");
var generalUtility = require("../../utility/general/utility");
var modelsUtility = require("../../utility/models/models");
var directionsTemplate = require("../../templates/direction/direction.hbs");

Backbone.$ = $;

var directionView = Backbone.View.extend( {
    el: ".route-direction",

    initialize: function () {
        this.listenTo( modelsUtility.directionCollection, "sync", this.render );
    },

    render: function () {
        var direction = Defaults.direction;
        var directionModel = modelsUtility.directionCollection.models;

        this.$directionSelect = $( "#direction-select" );

        this.$directionSelect.trigger( "chosen:updated" );

        if ( this.$directionSelect.find( "option" ).length > 1 ) {
            this.$directionSelect.find( "option:gt(0)" ).remove();
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

                Handlebars.registerHelper("lowercase", function(item) {
                    return item.toLowerCase();
                });                

                this.$directionSelect.append( directionsTemplate( data ) );
            }

            if ( typeof direction === "string" ) {
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

        return this;
    },

    events: {
        "change #direction-select": "showStops"
    },

    showStops: function () {
        var direction = $( "#direction-select" ).chosen().val();

        direction = generalUtility.urlEncode( direction );

        Defaults.direction = direction;

        Defaults.router.navigate( "!/" + Defaults.mode + "/" + Defaults.route + "/" + direction, {
            trigger: true
        } );
    },

    close: function () {
        if ( this.$directionSelect.length ) {
            this.$directionSelect.find( "option:gt(0)" ).remove();
        }

        modelsUtility.directionCollection.reset();
        this.stopListening( modelsUtility.directionCollection );

        this.$el.unbind();
        this.$el.hide();

        Defaults.direction = null;
    }
} );

module.exports = directionView;