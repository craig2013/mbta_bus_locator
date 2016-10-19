//Mode view
"use strict";

var $ = require("jquery");
var chosen = require("jquery-chosen");
var _ = require("underscore");
var Backbone = require("backbone");
var Handlebars = require("handlebars");
var Defaults = require("../../defaults");
var generalUtility = require("../../utility/general/utility");
var modelsUtility = require("../../utility/models/models");
var modesTemplate = require("../../templates/mode/mode.hbs");

Backbone.$ = $;

var modesView = Backbone.View.extend( {
    el: ".mode-type",

    initialize: function () {
        this.render();
    },

    render: function () {

        var mode = Defaults.mode;

        this.$modeSelect = $( "#mode-select" );

        this.$modeSelect.trigger( "chosen:updated" );

        this.$modeSelect.html( modesTemplate() );

        if ( typeof mode === "string" ) {
            this.$modeSelect.val(
                generalUtility.urlDecode( mode )
            ).trigger( "chosen:updated" );
        } else {
            this.$modeSelect.val( "0" ).trigger( "chosen:updated" );
        }

        this.$modeSelect.chosen( {
            no_results_text: "Nothing found.",
            width: "25%"
        } );

        $( ".container main .loading" ).hide();
        $( ".container main .content, .container main .content .route-info .mode-type" ).show();

        return this;
    },

    events: {
        "change #mode-select": "showRoutes"
    },

    showRoutes: function () {
        var mode = $( "#mode-select" ).chosen().val();

        mode = generalUtility.urlEncode( mode );

        if ( ( mode !== "0" ) && ( mode === "bus" || mode === "commuter+rail" || mode === "subway" ) ) {
            Defaults.mode = mode;

            Defaults.router.navigate( "!/" + mode, {
                trigger: true
            } );
        }
    },

    close: function () {
        this.$modeSelect.val( "0" ).trigger( "chosen:updated" );

        this.$el.unbind();

        Defaults.mode = null;
    }
} );

module.exports = modesView;