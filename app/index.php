<?php
error_reporting(E_ALL);
ini_set('display_errors', 'On');

require("includes/configuration/configuration.php");
require("includes/curl/curl.php");
require("models/direction/direction.php");
require("models/stops/stops.php");

$directionValue = (array_key_exists('directionValue',$_GET))? $_GET['directionValue'] : NULL;
$queryType = (array_key_exists('queryType',$_GET))? $_GET['queryType'] : NULL;
$queryString = (array_key_exists('queryString',$_GET))? $_GET['queryString'] : NULL;
$queryValue = (array_key_exists('queryValue',$_GET))? $_GET['queryValue'] : NULL;

$dev = true;

if ( $dev === true ) {
	$apiKey = "wX9NwuHnZU2ToO7GmGR9uw"; //MBTA Realtime API developer API key.
} else {
	$apiKey = "Mvkh9fP6s0a5dEep5gM8Kw";
}

$config = new Configuration();

$config->setUrl("http://realtime.mbta.com/developer/api/v2/");
$config->setApiKey($apiKey);
$config->setFormat("json");




if ( ($queryType === "stopsbyroute" && $queryString === "route") && ($queryValue === "green-b" || $queryValue === "green-c" || $queryValue === "green-d" || $queryValue === "green-e") && ($directionValue !== NULL) ) {
	$stops = new Stops();

	$stops->setRoute($queryValue);
	$stops->setDirection($directionValue);

	header('Content-Type: application/json');
	echo $stops->showRouteStops();
} else if ( $queryType === "direction" ) { 
	$directions = new Direction();

	$options = array(
		"api_key" => $config->getApiKey(),
		$queryString => $queryValue,
		"format" => $config->getFormat()
	);

	$curl = new Curl();
	$curl->setResponse(
			$config->getUrl(),
			"stopsbyroute",
			$options
		); 

	$route = $curl->getResponse(); 

	$directions->setRoute($route);

	header('Content-Type: application/json');
	echo $directions->showDirections();
} else {
	if ( $queryString === null ) {
		$options = array(
			"api_key" => $config->getApiKey(),
			"format" => $config->getFormat()
		);
	} else {
		$options = array(
			"api_key" => $config->getApiKey(),
			$queryString => $queryValue,
			"format" => $config->getFormat()
		);
	}	

	$curl = new Curl();
	$curl->setResponse(
			$config->getUrl(),
			$queryType,
			$options
		); 	

	header('Content-Type: application/json');
	echo $curl->getResponse();
}
?>