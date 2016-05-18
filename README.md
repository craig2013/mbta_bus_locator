#MBTA Tracker
(Formley MBTA Bus Locator)
 - Uses the feeds from the <a href="http://realtime.mbta.com/Portal/" target="_blank">MBTA Realtime API</a> for predictions.

##Version History

######Version 4.0.0
- Changed name from MBTA Bus Tracker to MBTA Tracker
- Switched to using the MBTA Realtime API instead of Nextbus.
- Expanded tracking to commuter rail, and subway.
- Reorganized models, collections, views, templates and added utility functions.
- Moved map view.
- Added vehicle label markers to map.

######Version 3.2.0
- Added more route information for the also at stop display.
- Improved various functions.

######Version 3.1.0
- Various improvements to functions.

######Version 3.0.0
- Switched to using RequireJS with Backbone.
- Moved functions into seperate files for better organization.

######Version 2.4.3
- Fixed some bugs with the countdown display.

######Version 2.4.2
- Added bus routes that also stop at a particular route.
- Added the jQuery Chosen plugin for the desktop view.
- Added a dynamic link to the bus route schedule.
- Cleaned up many functions and using more Underscore.js methods with the JSON.

######Version 2.3.2
- Added jQuery Chosen plugin for drop downs.
- Made various improvements to functions handleing JSON results.

######Version 2.2.2
- Started work on FAQ page.
- Made some style changes to the CSS.
- Made some fixes to the bus countdown view.

######Version 2.1.2
- Added map for seeing buses on route.

######Version 2.0.2
- Made various bug fixes.

######Version 2.0.1
- Made various improvements.

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