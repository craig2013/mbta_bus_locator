<?php

error_reporting(~0);
ini_set('display_errors', 1);

class Curl
{
	protected $url;

	public function __construct()
	{
		$this->url = "";
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

	public function getResponse( $url, $queryType, $properties = array() )
	{
		$ch = curl_init();
		$this->setURL($url, $queryType, $properties);
		$responseURL = $this->getURL();

		//echo '<a href="'.$responseURL.'">'.$responseURL."</a><br/>";
		
		curl_setopt($ch, CURLOPT_URL, $responseURL);
		curl_exec($ch);
	}
}
?>