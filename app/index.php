<?php
	error_reporting(~0);
	ini_set('display_errors', 1);

	require('includes/xmlToJSON.php');
	require('includes/directionService.php');
	require('includes/predictionService.php');

	$url = 'http://webservices.nextbus.com/service/publicXMLFeed';

	$command = (array_key_exists('command',$_GET))?$_GET['command']:'';
	$agency = (array_key_exists('agency',$_GET))?$_GET['agency']:'';
	$route = (array_key_exists('route',$_GET))?$_GET['route']:'';
	$stop = (array_key_exists('stopId',$_GET))?$_GET['stopId']:'';
	$direction = (array_key_exists('direction',$_GET))?$_GET['direction']:'';
	$routeTitle = (array_key_exists('routeTitle',$_GET))?$_GET['routeTitle']:'';


	$url = ( ($command === 'direction') || ($command === 'directionStops') )?$url.'?command=routeConfig&a='.$agency : $url.'?command='.$command.'&a='.$agency;
	

	if ( strlen($route) ) {
	    $url = $url.'&r='.$route;
	}

	if ( (strlen($stop)) && ($command == 'predictions' || $command === 'direction')) {
	    $url = $url.'&stopId='.$stop;
	}

	if ($command === 'vehicleLocations') {
	    $url = $url.'&t=100000000000';
	}	

	$toJSON = new XmlToJsonConverter();
	$toJSON->setFeedURL($url);
	$toJSON->parseXML();
	$toJSON->convertXMLToJSON();
	$json = $toJSON->getJSON();

	//Return only the direction objects for a route if direction is requested.
	if ( $command === 'direction' ) {
		$json = json_decode($json);
		$json = $json->route->direction;
		$json = json_encode($json);
	}	

	//Return just the route object and the direction stops if directionStops is requested.
	if ( $command === 'directionStops' ) {
		$json = json_decode($json);
		$routeStops = $json->route->stop;
		$directionStops = '';

		foreach ( $json->route->direction as $key => $value ) {
			if ( isset($value->attributes->tag) ) {
				if ( $value->attributes->tag === $direction ) {
					$directionStops = $value;			
				}				
			}  elseif ( isset($value->tag) ) {
				if ( $value->tag === $direction ) {
					$directionStops = $value;			
				}					
			}
		}

		$jsonObject = array(array('routeStops'=>$routeStops,'directionStops'=>$directionStops));

		$json = json_encode($jsonObject);

	}
	
	print_r($json);
?>