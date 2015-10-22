//also at stop
define([
            'jquery',
            'underscore',
            'backbone',
            'models/busCountdown',
            'collections/busCountdown',
            'text!templates/alsoAtStop.html'], function($,  _, Backbone, busCountdownModel, busCountdownCollection, alsoAtStopTemplate) {

            var alsoAtStopView = Backbone.View.extend({
                el: '.also-at-stop-container',

                 initialize: function () {
                     this.listenTo( this.model, 'sync', this.render );
                 },

                 render: function() {
                    var busData = ( this.model.length > 4 && Array.isArray( this.model ) ) ? this.model.slice( 0, 4 ) : this.model;
                    var data = {
                        'busTimes': busData
                    };                     
                    var predictionsCount = busData.length;   
                    var  template = _.template( alsoAtStopTemplate );

                    this.$el.find( '.bus-times' ).html( template(data) );

                    return this;                                      
                 }
            });

            return alsoAtStopView;
});
