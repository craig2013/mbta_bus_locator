<?php

class Config
{

	private $apiKey;
	private $format;
	private $url;

	/**
	 * Contructor that initalizes config options.
	 * @param string $apiKey The apiKey to use for the MBTA Realtime API.
	 * @param string $format The format to return from the API.
	 * @param string $url   The root URL for the API.
	 */
	public function __construct($apiKey = "", $format = "", $url = "")
	{
		$this->apiKey = $apiKey;
		$this->format = $format;
		$this->url = $url;
	}

	/**
	 * Returns the config option being requested.
	 * @param  string $option The name of the option you want to be returned.
	 * @return string The option being requested.         
	 */
	public function getConfig($option = "")
	{
		if ( $option === "apiKey" ) {
			return $this->apiKey;
		} elseif ( $option === "format" ) {
			return $this->format;
		} elseif ( $option === "url" ) {
			return $this->url;
		}
	}
}

