<?php
error_reporting(~0);
ini_set('display_errors', 1);

require("includes/configuration/configuration.php");
require("includes/curl/curl.php");

$queryType = (array_key_exists('queryType',$_GET))?$_GET['queryType'] : NULL;
$queryString = (array_key_exists('queryString',$_GET))?$_GET['queryString'] : NULL;
$queryValue = (array_key_exists('queryValue',$_GET))?$_GET['queryValue'] : NULL;

$config = new Configuration();

$config->setUrl("http://realtime.mbta.com/developer/api/v2/");
$config->setApiKey("Mvkh9fP6s0a5dEep5gM8Kw");
$config->setFormat("json");

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

$curl->getResponse(
		$config->getUrl(),
		$queryType,
		$options
	);
?>