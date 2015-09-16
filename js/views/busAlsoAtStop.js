 var app = app || {};

 ( function () {
     'use strict';

     app.views.busAlsoAtStop = Backbone.View.extend( {
         el: '.also-at-stop-container',

         template: _.template( $( '#tpl-also-at-stop' ).html() ),

         initialize: function () {
             this.listenTo( this.model, 'add', this.render );
         },

         render: function () {
             var busData = ( this.model.length > 4 && Array.isArray( this.model ) ) ? this.model.slice( 0, 4 ) : this.model;
             var predictionsCount = busData.length;

             app.activeViews.busAlsoAtStop = this;

             var alsoAtStopTemplate = this.template( {
                 'busTimes': busData
             } );

             this.$el.find( '.bus-times' ).html( alsoAtStopTemplate );

             return this;
         },

         clearCountdown: function () {
             //Clear any bus predictions
             this.$el.find( '.bus-time' ).each( function () {
                 $( this ).remove();
             } );
         },

         close: function () {
             this.clearCountdown();

             this.$el.hide();
             this.$el.unbind();
         }
     } );
 } )();
