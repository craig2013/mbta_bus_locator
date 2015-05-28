<?php
error_reporting(~0);
ini_set('display_errors', 1);

class predictionService {

	protected $json;
	protected $newJSON;
	protected $direction;
	protected $routeTitle;
	protected $predictions;
	protected $stopId;

	public function __construct() {
		$this->json='';
		$this->newJSON='';
		$this->direction='';
		$this->predictions='';
		$this->stopId='';
	}

	public function setJSON($val) {
		$this->json=$val;
	}

	public function setNewJSON($val) {
		$this->newJSON=$val;
	}

	public function setDirection($val) {
		$this->direction=$val;
	}

	public function setStopId($val) {
		$this->stopId=$val;
	}

	public function setRouteTitle($val) {
		$this->routeTitle=$val;
	}

	public function setPredictions($val) {
		$this->predictions=$val;
	}

	public function getJSON() {
		return $this->json;
	}

	public function getNewJSON() {
		return $this->newJSON;
	}

	public function getDirection() {
		return $this->direction;
	}

	public function getRouteTitle() {
		return $this->routeTitle;
	}

	public function getPredictions() {
		return $this->predictions;
	}

	public function getStopId() {
		return $this->stopId;
	}

	public function createPredictionJSON() {
		$json = $this->getJSON();
		$decodedJSON = json_decode($json,false);
		$this->setNewJSON($decodedJSON);	
	}

	public function getPredictionJSON() {
		$newJSON = $this->getNewJSON();
		$direction = $this->getDirection();
		$routeTitle = $this->getRouteTitle();
		$stopId = $this->getStopId();
		$newJSONString = '';
		$i = 0;


/*
echo '<pre>';
var_dump($newJSON);
echo '</pre>';
return 0;
*/

		if (isset($newJSON->predictions)) {
			$newJSONString = json_encode($newJSON);

			$this->setPredictions($newJSONString); 
		}
	}
}
?>