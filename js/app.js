define(['router'], function(router) {

    var initialize = function() {
        router.initialize();
    };
    
    return {
        initialize: initialize
    };

});

/**
 * Function is pollyfil for isArray for testing if a object is an array.
 *
 *
 * @return true if object is an array or false if it isn't.
 **/
if ( !Array.isArray ) {
    Array.isArray = function ( arg ) {
        return Object.prototype.toString.call( arg ) === '[object Array]';
    };
}


