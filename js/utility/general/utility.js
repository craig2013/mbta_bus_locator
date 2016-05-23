//General utility functions to be shared.
define( function () {
    "use strict";

    return {

        /**
         * This will concat 2 arrays based on a property passed in.
         *
         * @param  {Array} (array) The array of arrays to be combined.
         * @param  {String} (property) The property to look for.
         * @return {Array} (newArr) The new combined array.
         */
        concatArray: function ( array, property ) {
            if ( array[ property ].length >= 1 ) {
                var newArr = [];

                for ( var i = 0; i < array[ property ].length; i++ ) {
                    newArr = newArr.concat( array[ property ][ i ][ property ] );
                }

                return newArr;
            }

            return array[ property ];
        },

        /**
         * Convert the time in seconds passed in to a readable format in minutes.
         *
         * @param  {String} (time) The time in seconds represented as a String
         * @return {Integer} The time in minutes.
         */
        convertTime: function ( time ) {
            if ( this.isNumber( time ) ) {
                time = parseFloat( time );

                return Math.floor( ( ( ( time % 31536000 ) % 86400 ) % 3600 ) / 60 );
            }

            return 0;
        },

        /**
         * Check if value is a number.
         *
         * @param  {String} (number) The value to be checked if it is a number or not.
         * @return {Boolean} The boolean result of that test.
         */
        isNumber: function ( number ) {
            return ( !isNaN( number ) ) ? true : false;
        },

        /**
         * Sort the order of the predictions in the predictions array.
         *
         * @param  {Array} (array) The array to be sorted.
         * @return {Array} The sorted array.
         */
        sortPredictionOrder: function ( array ) {
            /**
             *
             * TODO: Add route name to other routes to display more information about route.
             *
             */
            var result = [];

            if ( Array.isArray( array ) ) {
                var otherRoutes = [];
                var selectedRoute = [];

                for ( var i = 0; i < array.length; i++ ) {
                    if ( array[ i ].route_id === Backbone.app.defaults.route ) {
                        selectedRoute.push(
                            array[ i ].direction[ 0 ].trip
                        );
                    } else {
                        var item = array[ i ].direction[ 0 ].trip;

                        for ( var j = 0; j < item.length; j++ ) {
                            item[ j ][ "route_name" ] = array[ i ].route_name;
                            otherRoutes.push( item[ j ] );
                        }
                    }
                }

                otherRoutes = _.flatten( otherRoutes );

                otherRoutes.sort( function ( a, b ) {
                    return parseInt( a.pre_away ) - parseInt( b.pre_away );
                } );

                selectedRoute.sort( function ( a, b ) {
                    return parseInt( a.pre_away ) - parseInt( b.pre_away );
                } );

                result.push( selectedRoute );
                result.push( otherRoutes );

            }

            return result;
        },
        /**
         * Sort the order of routes in the predictions array.
         *
         * @param  {Array} [array] The predictions array.
         * @param  {String} [selectedRoute] The selected route nmber.
         * @return {Array} [array] The predictions array sorted.
         */
        sortPredictionRoutes: function ( array, selectedRoute ) {
            if ( Array.isArray( array ) ) {
                if ( array[ 0 ].route_id !== Backbone.app.defaults.route ) {
                    var indexOfSelectedRoute = null;
                    var newArray = [];
                    var selectedRoute = _.find( array, function ( item ) {
                        return item.route_id === Backbone.app.defaults.route;
                    } );

                    indexOfSelectedRoute = array.indexOf( selectedRoute );

                    if ( indexOfSelectedRoute > -1 ) {
                        array.splice( indexOfSelectedRoute, 1 );
                    }

                    array.sort( function ( a, b ) {
                        return parseInt( b.route_id ) - parseInt( a.route_id );
                    } );
                }
            }
            return array;
        },

        /**
         * Capitalize ther first letters of all words in a string passed in.
         *
         * @param {String} [str] The string to format.
         * @return {String} The formatted string.
         **/
        titleCase: function ( str ) {
            return str.replace( /((cr)+)|(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g, function ( letter ) {
                return letter.toUpperCase();
            } );
        },

        /**
         * A custom method to encode the parameter within the URL.
         *
         * key: [" ": +], ["\": "%5C"], ["/": %2], ["&": "&amp;"]
         *
         * @param  {String} [str] The string to encode.
         * @return {String} The string encode.
         */
        urlEncode: function ( str ) {
            try {
                var newStr = str.replace( /(\s)/g, "+" ).replace( /(\\)/g, "%5C" ).replace( /(\/)/g, "%2F" ).replace( /(\&)/g, "&amp;" ).toLowerCase();

                return newStr;
            } catch ( e ) {
                return str;
            }
        },

        /**
         * A custom method to decode the parameter within the URL.
         *
         * key: [" ": +], ["\": "%5C"], ["/": %2], ["&": "&amp;"]
         *
         * @param  {String} [str] The string to encode.
         * @return {String} The string encode.
         */
        urlDecode: function ( str ) {
            try {
                var newStr = str.replace( /(\+)/g, " " ).replace( /(%5C)/g, "\\" ).replace( /(%2f)/g, "/" ).replace( /(&amp;)/g, "&" ).toLowerCase();

                return newStr;
            } catch ( e ) {
                return str;
            }
        },

        findString: function ( needle, haystack ) {
            if ( haystack.length >= 1 ) {
                needle = needle.replace( /([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1" );

                return new RegExp( needle ).test( haystack );
            }

            return false;
        }
    }
} );
