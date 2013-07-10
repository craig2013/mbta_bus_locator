<?php
ob_start();
header('Content-type: text');
header( "refresh:20;" );
//Varibles
$page = $_SERVER['PHP_SELF'].'?'.$_SERVER['QUERY_STRING'];
//1370399633976
$tansit_system = $_GET['transit_system'];
$root_number = $_GET['root_number'];
//$last_time = $_GET['last_time'];
$feed_url = 'http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocations&a='.$tansit_system.'&r='.$root_number.'&t=100000000000';



$xml = file_get_contents($feed_url);

echo $xml;
?>