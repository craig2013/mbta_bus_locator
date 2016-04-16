<?php
error_reporting(~0);
ini_set('display_errors', 1);

class Configuration 
{
	protected $url;
	protected $apiKey;
	protected $format;

	public function __construct()
	{
		$this->url = "";
		$this->apiKey = "";
		$this->format = "";
	}

	public function setUrl($url)
	{
		$this->url = $url;
	}

	public function getUrl() {
		return $this->url;
	}

	public function setApiKey($apiKey)
	{
		$this->apiKey = $apiKey;
	}

	public function getApiKey()
	{
		return $this->apiKey;
	}

	public function setFormat($format)
	{
		$this->format = $format;
	}

	public function getFormat()
	{
		return $this->format;
	}
}
?>