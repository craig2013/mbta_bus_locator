<?php
/**
 * Route for vehicle locations from selected route.
 *
 *  List vehicles for a route: http://mbta-bus-locator.dev/app/routes/bus/220/inbound/3626/vehicles
 */
$app->get('/routes/{mode}/{route}/{direction}/{stop}/vehicles', function ($request, $response, $args) use ($app, $config, $curl) {
    
    $this->logger->info("/routes/{mode}/{route}/{direction}/{stop}/vehicles");

    $dataResponse = "";
    $direction = $args["direction"];
    $jsonResponse = "";
    $jsonURL = "";
    $mode = $args["mode"];
    $route = $args["route"];

    $jsonURL = $config->getConfig("url").
                       "vehiclesbyroute?".
                       "api_key=".$config->getConfig("apiKey").
                       "&route=".$args["route"].
                       "&format=".$config->getConfig("format");

    $curl->setURL($jsonURL);

    $curl->setResponse();

    $dataResponse = $curl->getResponse();

    if ( $dataResponse ) {
      if ( $mode === "subway" ) {
        $dataResponse = json_decode($dataResponse, true);


        $modeName = $dataResponse["mode_name"];
        $routeId = $dataResponse["route_id"];
        $routeName = $dataResponse["route_name"];
        $routeType = $dataResponse["route_type"];
        $vehicles = array();

        foreach ( $dataResponse["direction"] as $key => $val ) {
          if ( strtolower($val["direction_name"]) === $direction ) {
            foreach ($val["trip"] as $k => $v) {
              array_push($vehicles, $v);
            }
          }
        }


        $data =  json_encode(array("route_id"=>$routeId, "route_name"=>$routeName, "route_type"=>$routeType, "mode_name"=>$modeName, "trip"=>$vehicles ));

        $jsonResponse = $data;

      } else {
        $jsonResponse = $dataResponse;
      }      

      if ( $dataResponse ) {
          return $response->withStatus(200)
                    ->withHeader('Content-Type', 'application/json')
                    ->write($jsonResponse);
        } else {
            return 0;
        }        
    }
});
