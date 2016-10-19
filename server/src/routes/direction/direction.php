<?php
/**
 * Route for directions only.
 *
 * List route directions: http://mbta-bus-locator.dev/app/routes/bus/220/direction
 */
$app->get('/routes/{mode}/{route}/direction', function ($request, $response, $args) use ($app, $config, $curl) {

    $this->logger->info("/routes/{mode}/{route}/direction");

    $dataResponse = "";
    $jsonURL = "";
    $jsonResult = array();
    $mode = $args["mode"];
    $route = $args["route"];
    $jsonResponse = array();
    $jsonURL = $config->getConfig("url").
                       "stopsbyroute?".
                       "api_key=".$config->getConfig("apiKey").
                       "&route=".$route.
                       "&format=".$config->getConfig("format");                       

    $curl->setURL($jsonURL);

    $curl->setResponse();

    $dataResponse = $curl->getResponse();

    if ( $dataResponse ) {
        $dataResponse = json_decode($dataResponse, true);

        // Loop through dataResults object and return the directions available for the route.
        foreach  ( $dataResponse as $obj ) {
            foreach ( $obj as $key => $value ) {
                $items = array();
                $items = array(
                    "direction_id" => $value["direction_id"],
                    "direction_name" => $value["direction_name"]
                );
                array_push($jsonResponse, $items);
            }
        }

        $jsonResponse = json_encode($jsonResponse);

        return $response->withStatus(200)
                                  ->withHeader('Content-Type', 'application/json')
                                  ->write($jsonResponse);
    } else {
        return 0;
    }
});