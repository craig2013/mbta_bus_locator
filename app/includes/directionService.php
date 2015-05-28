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
		
		/*echo '<pre>';
		var_dump($newJSON);
		echo '</pre>';
		return 0;*/

		if (isset($newJSON->Error)){
			$newJSONString = '{"directions":[';
			$newJSONString  = $newJSONString.'{';
			$newJSONString  = $newJSONString.'"error":"';
			$newJSONString  = $newJSONString.$newJSON->Error;
			$newJSONString  = $newJSONString.'"}';
			$newJSONString  = $newJSONString.']}';
		} else {
			$newJSONString = json_encode($newJSON);
			$this->setDirection($newJSONString);	
		}
	}
}
?>