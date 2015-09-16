<?php
error_reporting(~0);
ini_set('display_errors', 1);
class XmlToJsonConverter{

	protected $feedURL;
	protected $myXML;
	protected $json;

	public function __construct() {
		$this->feedURL='';
		$this->myXML='';
		$this->json='';
	}

	public function getFeedURL() {
		return $this->feedURL;
	}	

	public function getMyXML() {
		return $this->myXML;
	}	

	public function getJSON() {
		return $this->json;
	}

	public function setFeedURL($val) {
		$this->feedURL=$val;
	}

	public function setMyXML($val) {
		$this->myXML=$val;
	}

	public function setJSON($val) {
		$this->json=$val;
	}	

	public function parseXML() {
		$xmlString = '';
		$feed = $this->getFeedURL();

		$fileContents = file_get_contents($feed);

		// Remove tabs, newline, whitespaces in the content array
		$fileContents = str_replace(array("\n", "\r", "\t"), '', $fileContents);
		$xmlString = simplexml_load_string($fileContents);

		$this->setMyXML($xmlString);
	}

	public function convertXMLToJSON() {
		$jsonString = '';
		$xmlString = $this->getMyXML();
		$jsonString = json_encode($xmlString);
		$jsonString = str_replace('@attributes', 'attributes', $jsonString);
		$jsonString = str_replace('"attributes":{"copyright":"All data copyright MBTA 2015."},', '', $jsonString);
		$this->setJSON($jsonString);		
	}
}
?>