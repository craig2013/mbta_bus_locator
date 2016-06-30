<?php
error_reporting(E_ALL);
ini_set('display_errors', 'On');

require("includes/configuration/configuration.php");
require("includes/curl/curl.php");

$queryType = (array_key_exists('queryType',$_GET))? $_GET['queryType'] : NULL;
$queryString = (array_key_exists('queryString',$_GET))? $_GET['queryString'] : NULL;
$queryValue = (array_key_exists('queryValue',$_GET))? $_GET['queryValue'] : NULL;

$dev = true;

if ( $dev === true ) {
	$apiKey = "wX9NwuHnZU2ToO7GmGR9uw"; //MBTA Realtime API developer API key.
} else {
	$apiKey = "Mvkh9fP6s0a5dEep5gM8Kw";
}

//echo "queryValue: ".$queryValue."<br/>";

$config = new Configuration();

$config->setUrl("http://realtime.mbta.com/developer/api/v2/");
$config->setApiKey($apiKey);
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

/*echo $config->getUrl()."<br>";
echo "queryType: ".$queryType."<br/>";
echo "options: <br/><pre>";
var_dump($options);
echo "</pre>";*/

$curl->getResponse(
		$config->getUrl(),
		$queryType,
		$options
	);
?>