<?php
// DIC configuration

$container = $app->getContainer();

// view renderer
$container['renderer'] = function ($c) {
    $settings = $c->get('settings')['renderer'];
    return new Slim\Views\PhpRenderer($settings['template_path']);
};

// monolog
$container['logger'] = function ($c) {
    $settings = $c->get('settings')['logger'];
    $logger = new Monolog\Logger($settings['name']);
    $logger->pushProcessor(new Monolog\Processor\UidProcessor());
    $logger->pushHandler(new Monolog\Handler\StreamHandler($settings['path'], Monolog\Logger::DEBUG));
    return $logger;
};


$apiKey = "wX9NwuHnZU2ToO7GmGR9uw"; //dev api key
//$apiKey = "Mvkh9fP6s0a5dEep5gM8Kw";

require __DIR__ . '/config/config.php';

$config = new Config($apiKey, "json", "http://realtime.mbta.com/developer/api/v2/");

require __DIR__ . '/curl/curl.php';

$curl = new Curl();
