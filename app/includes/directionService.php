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
		$decodedJSON = json_decode($json,true);
		$newJSON = (array_key_exists('predictions',$decodedJSON) && array_key_exists('direction', $decodedJSON['predictions']))? $decodedJSON['predictions'] : '';		
		$this->setNewJSON($decodedJSON);
	}

	public function getDirections() {
		$newJSON = $this->getNewJSON();
		$newJSONString = '';
		$i = 0;
			
		if (!array_key_exists('dirTitleBecauseNoPredictions', $newJSON)) {
			$newJSONString = '{"directions":[';
			/*echo '<pre>';
			var_dump($newJSON);
			echo '<pre>';
			return 0;*/
			if (array_key_exists('predictions', $newJSON) && array_key_exists('direction', $newJSON['predictions'])) {
				foreach ($newJSON['predictions']['direction'] as $key => $value) { 
					if ($key === 'attributes') {
						if ($i>=1) {
							$newJSONString  = $newJSONString.',';
						}
						$newJSONString  = $newJSONString.'{';
						$newJSONString  = $newJSONString.'"direction":';
						$newJSONString  = $newJSONString.'"'.$value['title'].'"';
						$newJSONString  = $newJSONString.'}';						
					}
				}
			} else if (array_key_exists('predictions', $newJSON) && array_key_exists('direction', $newJSON['predictions'][1])) {
				foreach ($newJSON['predictions'][1]['direction'] as $key => $value) { 
					if ($key === 'attributes') {
						if ($i>=1) {
							$newJSONString  = $newJSONString.',';
						}
						$newJSONString  = $newJSONString.'{';
						$newJSONString  = $newJSONString.'"direction":';
						$newJSONString  = $newJSONString.'"'.$value['title'].'"';
						$newJSONString  = $newJSONString.'}';		
					}
					$i++;
				}			
			}
			$newJSONString  = $newJSONString.']}';
		} else {
			$newJSONString = '{';
			$newJSONString = $newJSONString.'"directions":{';
			$newJSONString = $newJSONString.'"error":"No predictions available for this stop."';
			$newJSONString = $newJSONString.'}';
			$newJSONString = $newJSONString.'}';
		}

		$this->setDirection($newJSONString);	
	}
}
?>