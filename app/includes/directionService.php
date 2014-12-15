<?php
error_reporting(~0);
ini_set('display_errors', 1);

class directionService {

	protected $json;
	protected $newJSON;
	protected $directions;


	public function __construct() {
		$this->json='';
		$this->newJson='';
		$this->directions='';
	}

	public function setJSON($val) {
		$this->json=$val;
	}

	public function setNewJSON($val) {
		$this->newJSON = $val;
	}

	public function setDirection($val) {
		$this->directions=$val;
	}

	public function getJSON() {
		return $this->json;
	}

	public function getNewJSON() {
		return $this->newJSON;
	}

	public function getDirection() {
		return $this->directions;
	}

	public function decodeJSON() {
		$json = $this->getJSON();
		$decodedJSON = json_decode($json,false);	
		$this->setNewJSON($decodedJSON);
	}

	public function getDirections() {
		$newJSON = $this->getNewJSON();
		$newJSONString = '';
		$i = 0;
		/*
		echo '<pre>';
		//var_dump($newJSON);
		echo ($newJSON->predictions->attributes->dirTitleBecauseNoPredictions);
		echo '</pre>';
		return 0;*/
		if (isset($newJSON->predictions->attributes->dirTitleBecauseNoPredictions)) {
			
		} else {
			if (is_object($newJSON->predictions) && is_array($newJSON->predictions->direction)) {
				$directionArray = $newJSON->predictions->direction;
				$newJSONString = '{"directions":[';
				foreach ($directionArray as $key => $value) {
					if ($i>=1) {
						$newJSONString  = $newJSONString.',';
					}
					$newJSONString  = $newJSONString.'{';
					$newJSONString  = $newJSONString.'"direction":"';
					$newJSONString  = $newJSONString.$value->attributes->title;
					$newJSONString  = $newJSONString.'"}';
					$i++;
				}	
				$newJSONString  = $newJSONString.']}';
			} else {
				if (isset($newJSON->predictions->direction->attributes->title) && strlen($newJSON->predictions->direction->attributes->title)) {
					$newJSONString = '{"directions":[';
					$newJSONString  = $newJSONString.'{';
					$newJSONString  = $newJSONString.'"direction":"';
					$newJSONString  = $newJSONString.$newJSON->predictions->direction->attributes->title;
					$newJSONString  = $newJSONString.'"}';
					$newJSONString  = $newJSONString.']}';
				} elseif (isset($newJSON->predictions[1]->direction->attributes->title) && strlen($newJSON->predictions[1]->direction->attributes->title)) {
					$newJSONString = '{"directions":[';
					$newJSONString  = $newJSONString.'{';
					$newJSONString  = $newJSONString.'"direction":"';
					$newJSONString  = $newJSONString.$newJSON->predictions[1]->direction->attributes->title;
					$newJSONString  = $newJSONString.'"}';
					$newJSONString  = $newJSONString.']}';			
				} 
			}
		}

		$this->setDirection($newJSONString);	
	}
}
?>