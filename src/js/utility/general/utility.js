//General utility functions to be shared.
define( function () {
    "use strict";

    return {

        clearTimer: function ( timer ) {
            try {
                clearTimeout( timer );
                timer = null;
            } catch ( e ) {
                console.log( "Error clearing timer." );
                console.log( e );

                return timer;
            }

            return timer;
        },

        /**
         * This will concat 2 arrays based on a property passed in.
         *
         * @param  {Array} (array) The array of arrays to be combined.
         * @param  {String} (property) The property to look for.
         * @return {Array} (newArr) The new combined array.
         */
        concatArray: function ( array, property ) {
            try {
                if ( array[ property ].length >= 1 ) {
                    var newArr = [];

                    for ( var i = 0; i < array[ property ].length; i++ ) {
                        newArr = newArr.concat( array[ property ][ i ][ property ] );
                    }

                    return newArr;
                }

                return array[ property ];
            } catch ( e ) {
                return 0;
            }

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
         * Capitalize ther first letters of all words in a string passed in. Also includes a fix for commutter rail routes that begin with CR-.
         *
         * @param {String} [str] The string to format.
         * @return {String} The formatted string.
         **/
        titleCase: function ( str ) {
            try {
                return str.replace( /((cr)+)|(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g, function ( letter ) {
                    return letter.toUpperCase();
                } );
            } catch ( e ) {
                return str;
            }
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
                var newStr = str.replace( /(\+)/g, " " ).replace( /(%5C)/g, "\\" ).replace( /(%2f)/g, "/" ).replace( /(&amp;)/g, "&" );

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
    };
} );
