//Mode view
define( [
    "jquery",
    "chosen",
    "underscore",
    "backbone",
    "utility/general/utility",
    "models/routes/routes",
    "collections/routes/routes",
    "text!templates/mode/mode.html"
], function ( $, chosen, _, Backbone, generalUtility, routesModel, routesCollection, modesTemplate ) {

    "use strict";

    var routesView = Backbone.View.extend( {
        el: ".mode-type",

        initialize: function () {
            routesCollection.fetch( {
                traditional: true,
                data: {
                    "queryType": "routes",
                }
            } );

            this.listenTo( routesCollection, "sync", this.render );
        },

        render: function () {

            var routeModel = routesCollection.models[ 0 ];
            var self = this;

            this.$modeSelect = $( "#mode-select" );

            this.$modeSelect.trigger( "chosen:updated" );

            if ( typeof routeModel === "object" ) {
                if ( this.$modeSelect.find( "option" ).length <= 1 ) {
                    var data = {
                        route: routeModel.attributes.mode
                    };

                    data.route = _.chain(data.route)
                                        .filter(function(item) { return item.mode_name !== "Boat" }) //No predictions for commuter boat at this time.
                                        .uniq(function(item) { return item.mode_name; })
                                        .sortBy(function(item) { return item.mode_name; })
                                        .value();

                    var modeTemplate = _.template( modesTemplate );

                    this.$modeSelect.append( modeTemplate( data ) );
                }
                
                if ( Backbone.app.defaults.mode !== null ) {
                    this.$modeSelect.val(
                            generalUtility.titleCase(generalUtility.urlDecode(Backbone.app.defaults.mode))
                    ).trigger("chosen:updated");
                } else {
                    this.$modeSelect.val("0").trigger("chosen:updated");
                }

               this.$modeSelect.chosen( {
                    no_results_text: "Nothing found.",
                    width: "25%"
                } );

                $( ".container main .loading" ).hide();
                $( ".container main .content, .container main .content .route-info .mode-type" ).show();

            }
        },

        events: {
            "change #mode-select": "showRoutes"
        },

        showRoutes: function(e) {
            var mode = $("#mode-select").chosen().val();
            mode = generalUtility.urlEncode(mode);

            if ( (mode !== "0") && (mode === "bus" || mode === "commuter+rail" || mode === "subway") ) {          
                Backbone.app.defaults.mode = mode;

                Backbone.app.router.navigate( 'mode/' + mode, {
                    trigger: true
                } );                    
            }
        },

        close: function () {
            this.$modeSelect.val("0").trigger("chosen:updated");

            this.$el.unbind();

            Backbone.app.defaults.modeType = null;
        }
    } );

    return routesView;
} );