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
			if (isset($newJSON->predictions->attributes->stopTag) && isset($newJSON->predictions->attributes->routeTitle)) {
				if ($newJSON->predictions->attributes->stopTag === $stopId && $newJSON->predictions->attributes->routeTitle === $routeTitle) {
					if (isset($newJSON->predictions->direction) && (!is_array($newJSON->predictions->direction))) {
						if ($newJSON->predictions->direction->attributes->title===$direction) {
							if (is_array($newJSON->predictions->direction->prediction)) {
								$newJSONString = $newJSON->predictions->direction->prediction[0];
							} else {
								$newJSONString = $newJSON->predictions->direction->prediction;
							}
							$newJSONString  = utf8_encode(json_encode($newJSONString));
							$this->setPredictions($newJSONString); 						
						}
					} elseif (isset($newJSON->predictions->direction) && (is_array($newJSON->predictions->direction))) {
						foreach ($newJSON->predictions->direction as $key => $value) {
							if (isset($value->attributes->title) && $value->attributes->title===$direction) {
								if (is_array($value->prediction)) {
									$newJSONString = $value->prediction[0]->attributes;
								} else {
									$newJSONString = $value->prediction->attributes;
								}
							}
						}
							$newJSONString  = utf8_encode(json_encode($newJSONString));
							$this->setPredictions($newJSONString); 
					}
				}
			} elseif (isset($newJSON->predictions[1]->attributes->stopTag) && isset($newJSON->predictions[1]->attributes->routeTitle)) {
				if ($newJSON->predictions[1]->attributes->stopTag === $stopId && $newJSON->predictions[1]->attributes->routeTitle === $routeTitle) {
					if ($newJSON->predictions[1]->direction->attributes->title===$direction) {
						if (is_array($newJSON->predictions[1]->direction->prediction)) {
							$newJSONString = $newJSON->predictions[1]->direction->prediction[0];
						} else {
							$newJSONString = $newJSON->predictions[1]->direction->prediction;
						}
						$newJSONString  = utf8_encode(json_encode($newJSONString));
						$this->setPredictions($newJSONString); 	
					}
				}				
			}
		}
	}
}
?>