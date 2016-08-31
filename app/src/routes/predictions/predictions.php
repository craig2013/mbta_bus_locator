<?php
/**
 * Route for predictions from selected stop.
 *
 * List predictions for a particular stop: http://mbta-bus-locator.dev/app/routes/bus/220/inbound/3626
 */
$app->get('/routes/{mode}/{route}/{direction}/{stop}', function ($request, $response, $args) use ($app, $config, $curl) {

  $this->logger->info("/routes/{mode}/{route}/{direction}/{stop}");

  $dataResponse = "";
  $direction = $args["direction"];
  $jsonURL = "";
  $jsonResponse = array();
  $mode = $args["mode"];
  $route =  $args["route"];
  $stop = urlencode($args["stop"]);

  $jsonURL = $config->getConfig("url").
                     "predictionsbystop?".
                     "api_key=".$config->getConfig("apiKey").
                     "&stop=".$stop.
                     "&format=".$config->getConfig("format");                       

  $curl->setURL($jsonURL);

  $curl->setResponse();

  $dataResponse = $curl->getResponse();            

  if ( $dataResponse ) {
      $dataResponse = json_decode($dataResponse, true);
      
      $jsonResponse = $dataResponse;
      $jsonResponse = json_encode($jsonResponse);
      
      return $response->withStatus(200)
                                ->withHeader('Content-Type', 'application/json')
                                ->write($jsonResponse);           
  } else {
      return 0;
  }

});