<?php
/*
    Description : The following class converts XML data into JSON format
    Author: Dnyanesh Pawar,
    Modified by: Craig Stroman
    Copyright: Dnyanesh Pawar (http://www.techrecite.com)
    Link: http://www.techrecite.com
    See the GNU General Public License for more details: http://www.creativecommons.org/
*/
class XmlToJsonConverter {
    public function ParseXML ($url) {
        $fileContents = file_get_contents($url);
        // Remove tabs, newline, whitespaces in the content array
        $fileContents = str_replace(array("\n", "\r", "\t"), '', $fileContents);
        $fileContents = trim(str_replace('"', "'", $fileContents));
        $myXml = simplexml_load_string($fileContents);
        $json = json_encode($myXml);
        $json = str_replace('@attributes', 'attributes', $json);
        return $json;
    }
}

$url = 'http://webservices.nextbus.com/service/publicXMLFeed';
$command = $_GET['command'];
$agency = $_GET['agency'];
$route = $_GET['route'];
$stop = $_GET['stopId'];

$url = $url.'?command='.$command.'&a='.$agency;

if(strlen($route)){
    $url = $url.'&r='.$route;
}


if(strlen($stop) && $command == 'predictions'){
    $url = $url.'&stopId='.$stop;
}

if($command === 'vehicleLocations'){
    $url = $url.'&t=100000000000';
}
//echo '<br/>'.$url.'<br/>';
//Create object of the class
$jsonObj = new XmlToJsonConverter();
 
//Pass the xml document to the class function
$myjson = $jsonObj->ParseXMl($url);
print_r ($myjson);
?>