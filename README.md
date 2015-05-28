#MBTA Bus Locator
 - Uses the XML feeds from NextBus (http://www.nextbus.com/) to display MBTA bus predictions.

##Version History

######Version 2.0.0
- Switched to using the Backbone framework.
- Removed map for now.
- Changed order of prediction interface to route, direction, then stops.
- Now displaying prediction for the next 3 buses if there is that many.

######Version 1.4
 - Various UI improvements.
 - Added ability to zoom into selected stop.

 ######Version 1.3
  - Fixed JSON for direction and predictions.

 ######Version 1.2
  - Converts XML feeds to JSON.
  - Displays a countdown for when the next bus will arive at a stop.
  - Using Underscore.js templates.
  - Using SASS for the CSS.

######Version 1.1
 - Plots all bus stops for routes on the map.
 - Plots all buses currently on the route.
 - Updates bus locations every 10 seconds when it changes.

 ######Version 1.0
  - Plots all bus stops for routes on the map. 