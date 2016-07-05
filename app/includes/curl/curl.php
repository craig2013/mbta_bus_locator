<?php

error_reporting(~0);
ini_set('display_errors', 1);

class Curl
{
	protected $url;
	protected $response;

	public function __construct()
	{
		$this->url = "";
		$this->response = "";
	}

	public function buildURL( $queryType, $properties = array() )
	{
		$queryString = $queryType;

		if ( !empty($properties) ) {
			$i = 0;
			$queryString = $queryString."?";

			foreach ($properties as $key => $value) {
				if ( $i >= 1 ) {
					$queryString = $queryString."&";
				}					

				$queryString = $queryString.$key."=".urlencode($value);

				$i++;
			}
		}

		return $queryString;
	}

	public function setURL( $url, $queryType, $properties = array() )
	{
		$this->url = $url.$this->buildURL($queryType, $properties);
	}
	public function getURL()
	{
		return $this->url;
	}

	public function setResponse( $url, $queryType, $properties = array() )
	{
		$ch = curl_init();
		$this->setURL($url, $queryType, $properties);
		$responseURL = $this->getURL();
		
		curl_setopt($ch, CURLOPT_URL, $responseURL);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		
		$this->response = curl_exec($ch);

		curl_close($ch);
	}

	public function getResponse()
	{
		return $this->response;
	}
}
?>