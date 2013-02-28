<?php
ob_start();
header('Content-type: text/xml');
header( "refresh:10;" );
//Varibles
$page = $_SERVER['PHP_SELF'].'?'.$_SERVER['QUERY_STRING'];
$tansit_system = $_GET['transit_system'];
$root_number = $_GET['root_number'];
$feed_url = 'http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocations&a='.$tansit_system.'&r='.$root_number;



$xml = file_get_contents($feed_url);

echo $xml;
?>