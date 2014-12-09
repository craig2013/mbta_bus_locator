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

	$url = ($command === 'direction')?$url.'?command=predictions&a='.$agency:$url.'?command='.$command.'&a='.$agency;

	if (strlen($route)) {
	    $url = $url.'&r='.$route;
	}

	if ((strlen($stop)) && ($command == 'predictions' || $command === 'direction')) {
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

	if ($command === 'direction') {
		$directions = new directionService();
		$directions->setJSON($json);
		$directions->decodeJSON();
		$directions->getDirections();
		$json = $directions->getDirection();
	}	

	if ($command==='predictions') {
		$predictions = new predictionService();
		$predictions->setJSON($json);
		$predictions->setDirection($direction);
		$predictions->setRouteTitle($routeTitle);
		$predictions->setStopId($stop);
		$predictions->createPredictionJSON();
		$predictions->getPredictionJSON();
		$json = $predictions->getPredictions();
	}
	
	print_r($json);
?>