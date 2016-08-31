<?php
// Routes

// Get the routes for the selected mode.
require __DIR__ . '/routes/routes.php';

// Get the direction for the selected route.
require __DIR__ . '/direction/direction.php';

// Get stops by the route and/or for Green Line because not all Green Line stops are available yet.
require __DIR__ . '/stops/stops.php';

// Get predictions for a selected stop.
require __DIR__.'/predictions/predictions.php';

// Get vehicle locations for selected route.
require __DIR__.'/vehicles/vehicles.php';