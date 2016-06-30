//Routes view
define( [
    "jquery",
    "chosen",
    "underscore",
    "backbone",
    "utility/general/utility",
    "text!templates/error/error.html"
], function ( $, chosen, _, Backbone, generalUtility, errorTemplate ) {

    "use strict";

    var errorView = Backbone.View.extend( {
        el: ".route-stops",

        initialize: function () {
            this.render();
        },

        render: function () {


            //var stopTemplate = _.template( stopsTemplate );

            // this.$stopsSelect.append( stopTemplate( data ) );
            return this;
        },

        close: function () {
            if ( this.$stopsSelect.length ) {
                this.$stopsSelect.find( 'option:gt(0)' ).remove();
            }

            stopsCollection.reset();
            this.stopListening( stopsCollection );

            this.$el.unbind();
            this.$el.hide();

            Backbone.app.defaults.stop = null;
        }
    } );

    return errorView;
} );
