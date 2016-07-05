<?php
	error_reporting(~0);
	ini_set('display_errors', 1);

class GreenLine
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

	public function showRouteStops()
	{
		$directionSelected = $this->getDirection();
		$routeSelected = $this->getRoute();

		if ( $routeSelected === "green-b" ) {
			if ( $directionSelected === "eastbound" ) {
				$json = file_get_contents('stops/green-b/eastbound.json', FILE_USE_INCLUDE_PATH);
			} else if ( $directionSelected === "westbound" ) {
				$json = file_get_contents('stops/green-b/westbound.json', FILE_USE_INCLUDE_PATH);
			}
			return $json;
		} else if ( $routeSelected === "green-c" ) {
			if ( $directionSelected === "eastbound" ) {
				$json = file_get_contents('stops/green-c/eastbound.json', FILE_USE_INCLUDE_PATH);
				return $json;
			} else if ( $directionSelected === "westbound" ) {
				$json = file_get_contents('stops/green-c/westbound.json', FILE_USE_INCLUDE_PATH);
				return $json;
			}
		} else if ( $routeSelected === "green-d" ) {
			if ( $directionSelected === "eastbound" ) {
				$json = file_get_contents('stops/green-d/eastbound.json', FILE_USE_INCLUDE_PATH);
				return $json;
			} else if ( $directionSelected === "westbound" ) {
				$json = file_get_contents('stops/green-d/westbound.json', FILE_USE_INCLUDE_PATH);
				return $json;
			}
		} else if ( $routeSelected === "green-e" ) {
			if ( $directionSelected === "eastbound" ) {
				$json = file_get_contents('stops/green-d/eastbound.json', FILE_USE_INCLUDE_PATH);
				return $json;
			} else if ( $directionSelected === "westbound" ) {
				$json = file_get_contents('stops/green-d/westbound.json', FILE_USE_INCLUDE_PATH);
				return $json;
			}
 		}
	}
}

?>