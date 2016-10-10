/*    return {
        validateStop: function ( route, direction, stop ) {
            var result = false;
            direction = generalUtility.urlDecode( direction );
            stop = generalUtility.urlDecode( stop );

            $.ajax( {
                url: "/app/",
                dataType: "json",
                data: {
                    "queryType": "stopsbyroute",
                    "queryString": "route",
                    "queryValue": route
                },
                success: function ( response ) {
                    console.log( "validate stop: " );
                    // console.log("direction: " + direction);
                    // console.log("stop: " + stop);
                    // console.log("response:");
                    // console.log(response);

                    var stops = [];
                    for ( var i = 0; i < response.length; i++ ) {
                        if ( response[ i ].direction_name.toLowerCase() === direction ) {
                            stops = response[ i ].stop;
                            break;
                        }
                    }

                    for ( var i = 0; i < stops.length; i++ ) {
                        if ( stops[ i ].stop_id.toLowerCase() === stop ) {
                            Backbone.app.defaults.stopName = stops[ i ].stop_id;
                            result = true;
                            break;
                        }
                    }
                }
            } );

            return result;
        },*/
