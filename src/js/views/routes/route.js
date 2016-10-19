//Routes view
"use strict";

var $ = require("jquery");
var chosen = require("jquery-chosen");
var _ = require("underscore");
var Backbone = require("backbone");
var Handlebars = require("hbsfy/runtime");
var Defaults = require("../../defaults");
var generalUtility = require("../../utility/general/utility");
var modelsUtility = require("../../utility/models/models");
var routesTemplate = require("../../templates/route/route.hbs");

var routesView = Backbone.View.extend( {
    el: ".routes-available",

    initialize: function () {
        this.listenTo( modelsUtility.routesCollection, "add", this.render );
    },

    render: function () {
        var route = Defaults.route;
        var routeModel = modelsUtility.routesCollection.models[ 0 ];

        this.$routeSelect = $( "#route-select" );
        this.$routeSelect.trigger( "chosen:updated" );

        if ( this.$routeSelect.find( "option" ).length > 1 ) {
            this.$routeSelect.find( "option:gt(0)" ).remove();
        }

        if ( typeof routeModel === "object" ) {
            if ( ( this.$routeSelect.find( "option" ).length <= 1 ) || ( this.$routeSelect.find( "option" ).length === 1 ) ) {
                var data = {
                    route: routeModel.attributes.route
                };

                data.route = _.sortBy( data.route, function ( item ) {
                    if ( isNaN( item.route_name.substring( 0, 2 ) ) ) { //Sort by route name if route name is a word.
                        return item.route_name;
                    } else { //Sort by route id if route name is a number.
                        return item.route_id.length;
                    }
                } );

                Handlebars.registerHelper("lowercase", function(item) {
                    return item.toLowerCase();
                });

                this.$routeSelect.append( routesTemplate( data ) );
            }


            if ( typeof route === "string" ) {
                this.$routeSelect.val(
                    generalUtility.urlDecode( route )
                ).trigger( "chosen:updated" );
            } else {
                this.$routeSelect.val( "0" ).trigger( "chosen:updated" );
            }

            this.$routeSelect.chosen( {
                no_results_text: "Nothing found.",
                width: "25%"
            } );

            $( ".container main .content .route-info .routes-available" ).show();

            return this;
        }
    },

    events: {
        "change #route-select": "showDirection"
    },

    /**
     * This will show the direction view when a route has been selected.
     * @param  {Object} e The event object of the route select box.
     */
    showDirection: function () {
        var mode = Defaults.mode;
        var route = this.$routeSelect.chosen().val();

        route = ( mode === "bus" ) ? route : generalUtility.urlEncode( route );

        Defaults.route = route;

        Defaults.router.navigate( "!/" + mode + "/" + route, {
            trigger: true
        } );
    },

    /**
     * Method will close the route view.
     */
    close: function () {
        if ( this.$routeSelect.length ) {
            this.$routeSelect.find( "option:gt(0)" ).remove();
        }

        modelsUtility.routesCollection.reset();
        this.stopListening( modelsUtility.routesCollection );

        this.$el.unbind();
        this.$el.hide();

        Defaults.route = null;
    }
} );

module.exports = routesView;