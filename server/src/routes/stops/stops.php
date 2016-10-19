<?php
/**
 * Route for stops.  Can be by direction or by route only.
 *
 * List route stops after direction selected:
 * http://mbta-bus-locator.dev/app/routes/bus/220/inbound || http://mbta-bus-locator.dev/app/routes/bus/220/
 */
$app->get('/routes/{mode}/{route}/[{direction}]', function ($request, $response, $args) use ($app, $config, $curl) {

    $this->logger->info("/routes/{mode}/{route}/[{direction}]");

    $dataResponse = "";
    $direction = ( isset($args["direction"]) ) ? $args["direction"] : "";
    $jsonResponse = "";
    $jsonURL = "";
    $mode = $args["mode"];
    $route = $args["route"];

    //Special case for Green Line routes because not all green line stops available yet, so uses local json files.
    if ( $route === "green-b" || $route === "green-c" || $route === "green-d" || $route === "green-e" ) {		
        $jsonURL = $_SERVER['HTTP_HOST']."/app/models/stops/subway/green-line/".$route."/".$direction.".json";

        $curl->setURL($jsonURL);

        $curl->setResponse();

        $dataResponse = $curl->getResponse(); 

        $jsonResponse = $dataResponse;           
    } else {

        $jsonURL = $config->getConfig("url").
                            "stopsbyroute?".
                            "api_key=".$config->getConfig("apiKey").
                            "&route=".$args["route"].
                            "&format=".$config->getConfig("format");    
		

        $curl->setURL($jsonURL);

        $curl->setResponse();

        $dataResponse = $curl->getResponse();	

        if ( $dataResponse ) {
            

            if ( strlen($direction) ) {
                $dataResponse = json_decode($dataResponse, true);

                foreach ( $dataResponse as $obj ) {
                    foreach ( $obj as $key => $value ) {
                        if ( strtolower($value["direction_name"]) === $direction ) {
                            $jsonResponse = $value["stop"];
                        }
                    }
                } 

                $jsonResponse = json_encode($jsonResponse);               
            } else {
                $jsonResponse = $dataResponse;
            }
        }
    }


    if ( $dataResponse ) {
    	return $response->withStatus(200)
    			  ->withHeader('Content-Type', 'application/json')
    			  ->write($jsonResponse);
    } else {
    	return 0;
    }
});