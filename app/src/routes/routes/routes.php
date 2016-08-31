<?php
/**
 * Route for routes based on mode.
 *
 * List routes: http://mbta-bus-locator.dev/app/routes/bus 
 */
$app->get('/routes/{mode}', function ($request, $response, $args) use ($app, $config, $curl) {

    $this->logger->info("/routes/{mode}");

    $dataResponse = "";
    $jsonURL = "";
    $jsonResponse = array();
    $mode = strtolower($args["mode"]);

    $jsonURL = $config->getConfig("url").
                       "routes?".
                       "api_key=".$config->getConfig("apiKey").
                       "&format=".$config->getConfig("format");                       

    $curl->setURL($jsonURL);

    $curl->setResponse();

    $dataResponse = $curl->getResponse();            

    if ( $dataResponse ) {
        $dataResponse = json_decode($dataResponse, true);

        $mode = str_replace("+", " ", $mode);

        $tempRoutes = array();
        
        /**
         * Loop through dataResults object and find matching mode to return routes.
         * Combines the different types of subway's, both light and heavy rail into one array of objects.
         */
        if ( $mode === "subway" ) { 
            foreach ( $dataResponse as $obj ) {
                foreach ($obj as $key => $value) {
                    if ( $value["mode_name"] ) {
                        if ( strtolower($value["mode_name"]) === $mode ) {
                            foreach ($value["route"] as $val) {
                                array_push($tempRoutes, $val);
                            }
                        }
                    }        
                }
            }

            $jsonResponse = json_encode(array("mode_name"=>$mode, "route"=>$tempRoutes));
        } else {
            foreach ( $dataResponse as $obj ) {
                foreach ( $obj as $key => $value ) {
                    if ( $value["mode_name"] ) {
                        if ( strtolower($value["mode_name"]) === $mode ) {
                            array_push($jsonResponse, $value);
                        }
                    }                  
                }
            }     

            $jsonResponse = json_encode($jsonResponse);       
        }

        return $response->withStatus(200)
                                  ->withHeader('Content-Type', 'application/json')
                                  ->write($jsonResponse);
    } else {
        return 0;
    }
});