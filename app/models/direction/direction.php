<?php
error_reporting(~0);
ini_set('display_errors', 1);	

class Direction
{
	protected $direction;
	protected $route;

	public function __construct()
	{
		$this->direction = "";
		$this->route = "";
	}

	public function setDirection($direction)
	{
		$this->direction = $direction;
	}

	public function getDirection()
	{
		return $this->direction;
	}

	public function setRoute($route) 
	{
		$this->route = $route;
	}

	public function getRoute()
	{
		return $this->route;
	}

	public function showDirections()
	{
		$json = $this->getRoute();

		$json = json_decode($json, true);

		$result = [];

		foreach ($json as $key => $value) {
			foreach ($value as $k => $v) {
				$items = array( "direction_id" => $v["direction_id"], "direction_name" => $v["direction_name"] );

				array_push($result, $items);
			}	
		}

		$result = json_encode($result);

		return $result;
	}		
}
?>