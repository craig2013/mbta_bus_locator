<?php
error_reporting(9999);
    $lat = $_GET['lat'];
    $lon = $_GET['lon'];
    
    if(strlen($lat) && strlen($lon)){
        $url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='.$lat.','.$lon.'&sensor=true&key=AIzaSyACgfrv9zazAkfhLEMeddFJnxZ6P2FyGnU';

        $result = file_get_contents($url);
        
        if(strlen($result)){
           echo $result;
        }
    }
?>