<?php

class Curl
{
	protected $url;
	protected $response;

	public function __construct()
	{
		$this->url = "";
		$this->response = "";
	}

	/**
	 * Set the URL variable.
	 * @param [String] $url The URL to be used for the curl function.
	 */
	public function setURL( $url )
	{
		$this->url = $url;
	}

	/**
	 * Gets the URL variable and returns the value.
	 * @return [String] The URL value.
	 */
	public function getURL()
	{
		return $this->url;
	}

	/**
	 * Sets the curl object for getting the response.
	 */
	public function setResponse()
	{
		$ch = curl_init();
		$responseURL = $this->getURL();
		
		curl_setopt($ch, CURLOPT_URL, $responseURL);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		
		$this->response = curl_exec($ch);

		curl_close($ch);
	}

	/**
	 * Returns the curl response.
	 * @return [Object] The curl response object.
	 */
	public function getResponse()
	{
		return $this->response;
	}		
}