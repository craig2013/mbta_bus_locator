<?php
error_reporting(~0);
ini_set('display_errors', 1);

class directionService {

	private $json;
	private $newJSON;
	private $directions;

	public function __construct(){
		$this->json='';
		$this->newJson='';
		$this->directions='';
	}

	public function setJSON($val){
		$this->json=$val;
	}

	public function setNewJSON($val){
		$this->newJSON = $val;
	}

	public function setDirection($val){
		$this->directions=$val;
	}

	public function getJSON(){
		return $this->json;
	}

	public function getNewJSON(){
		return $this->newJSON;
	}

	public function getDirection(){
		return $this->directions;
	}

	public function decodeJSON(){
		$json = $this->getJSON();
		$decodedJSON = json_decode($json,true);
		$newJSON = $decodedJSON['predictions'];		
		$this->setNewJSON($newJSON);
	}

	public function getDirections(){
		$newJSON = $this->getNewJSON();
		$newJSONString = '{"directions":[';
		$i = 0;


		foreach($newJSON as $value){
		    if(is_array($value)){
		        foreach ($value as $key => $value) {
		            if($key === 'direction'){
		                if($i>0){
		                    $newJSONString = $newJSONString.',';
		                }
		                $newJSONString = $newJSONString.'{';
		                $newJSONString = $newJSONString.'"direction":';
		                $newJSONString = $newJSONString.'"'.$value['attributes']['title'].'"';
		                $newJSONString = $newJSONString.'}';
		                $i+=1;
		            }
		        }
		    }
		}

		$newJSONString = $newJSONString.']}';

		$this->setDirection($newJSONString);
	}
}
?>