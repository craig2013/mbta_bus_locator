//Routes view
define( [
    "jquery",
    "chosen",
    "underscore",
    "backbone",
    "utility/general/utility",
    "models/routes/routes",
    "collections/routes/routes",
    "text!templates/route/route.html"
], function ( $, chosen, _, Backbone, generalUtility, routesModel, routesCollection, routesTemplate ) {

    "use strict";

    var routesView = Backbone.View.extend( {
        el: ".routes-available",

        initialize: function () {
            routesCollection.fetch( {
                reset: true,
                data: {
                    "queryType": "routes",
                }
            } );

            this.listenTo( routesCollection, "sync", this.render );
        },

        render: function () {
            var routeModel = routesCollection.models[ 0 ];

            var self = this;

            this.$routeSelect = $( "#route-select" );

            this.$routeSelect.trigger( "chosen:updated" );

            if ( typeof routeModel === "object" ) {
                if ( this.$routeSelect.find( "option" ).length <= 1 ) {
                    var data = {
                        route: routeModel.attributes.mode
                    }

                    data.route = _.filter(data.route, function(item, key) {
                            return item.mode_name.toLowerCase() === generalUtility.urlDecode(Backbone.app.defaults.mode);
                    });     

                   data.route = generalUtility.concatArray(data, "route");

                    data.route = _.sortBy(data.route, function(item, key) {
                        return  item.route_name;
                    });                    

                    var routeTemplate = _.template( routesTemplate );

                    this.$routeSelect.append( routeTemplate( data ) );
                }

                if ( Backbone.app.defaults.route !== null ) {
                    this.$routeSelect.val(
                            generalUtility.titleCase(
                                generalUtility.urlDecode(
                                    Backbone.app.defaults.route
                                )
                            )
                    ).trigger("chosen:updated");
                } else {
                    this.$routeSelect.val("0").trigger("chosen:updated");
                }                

               this.$routeSelect.chosen( {
                    no_results_text: "Nothing found.",
                    width: "25%"
                } );

                $( ".container main .content .route-info .routes-available" ).show();
            }
        },

        events: {
            "change #route-select": "showDirection"
        },

        showDirection: function(e) {
            var route = $("#route-select").chosen().val();
            
            route = generalUtility.urlEncode(route);

            Backbone.app.defaults.route = route;

            Backbone.app.router.navigate("mode/" + Backbone.app.defaults.mode + "/route/" + route,{
                trigger: true
            });
        },

        close: function () {
            if ( this.$routeSelect.length ) {
                this.$routeSelect.find( 'option:gt(0)' ).remove();
            }

             this.stopListening( routesCollection );

            this.$el.unbind();
            this.$el.hide();

            Backbone.app.defaults.route = null;
        }
    } );

    return routesView;
} );