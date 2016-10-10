//Load templates.
define( [
    "text!templates/predictions/boat/boat.html",
    "text!templates/predictions/bus/bus.html",
    "text!templates/predictions/commuter-rail/commuter-rail.html",
    "text!templates/predictions/subway/subway.html",
    "text!templates/map/map.html"
], function ( boatTemplate, busTemplate, commuterRailTemplate, subwayTemplate, mapTemplate ) {

    "use strict";

    return {
        boatTemplate: boatTemplate,
        busTemplate: busTemplate,
        commuterRailTemplate: commuterRailTemplate,
        subwayTemplate: subwayTemplate,
        mapTemplate: mapTemplate
    };
} );
