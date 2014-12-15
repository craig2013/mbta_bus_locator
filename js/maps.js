(function () {
    var busLocator = {
        settings: {
            vehicles: '',
            agencyTag: '',
            lastTime: '',
            map: '',
            mapOptions: '',
            route: '',
            routeNumber: '',
            routeTitle: '',
            routeStops: '',
            stops: '',
            stopMarkers: '',
            selectedStop: {},
            selectedDirection: '',
            timer: '',
            timerStarted: false,
            displayNextTime: false
        },

        // Initializes app 
        init: function () {
            busLocator.settings.vehicles = new Array();
            busLocator.settings.agencyTag = 'mbta';

            clearTimeout(busLocator.settings.timer);


            //Initialize Google maps and center map on Boston
            busLocator.settings.mapOptions = {
                zoom: 11,
                center: new google.maps.LatLng(42.358056, -71.063611),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            busLocator.settings.map = new google.maps.Map(document.getElementById('map_canvas'), busLocator.settings.mapOptions);

            //Load route list
            busLocator.setRouteList();
        },

        // Loads all routes available to route list dropdown
        setRouteList: function () {
            $.ajax({
                async: false,
                cache: false,
                type: 'GET',
                url: '../app/?command=routeList&agency=' + busLocator.settings.agencyTag,
                dataType: 'json',
                success: function (response) {
                    if (typeof response.route === 'object') {

                        _.templateSettings.variable = 'routes';

                        var template = _.template(
                            $('#routes-template').html()
                        );

                        var templateData = response.route;

                        $('#route_select').append(template(templateData));

                        $('.container .loading').hide();
                        $('.container .content #routes .routesAvailable,.container footer').show();
                    }
                }
            });
        },

        // Loads stops for selected route
        getRouteStops: function () {
            $.ajax({
                async: false,
                cache: false,
                type: 'GET',
                url: '../app/?command=routeConfig&agency=' + busLocator.settings.agencyTag + '&route=' + busLocator.settings.routeNumber,
                dataType: 'json',
                success: function (response) {
                    if (typeof response.route === 'object') {
                        var centerLat = response.route.attributes.latMin,
                            centerLon = response.route.attributes.lonMin,
                            routeOptions = {
                                'centerLat': centerLat,
                                'centerLon': centerLon
                            };
                        busLocator.settings.routeTitle = response.route.attributes.title;
                        busLocator.setRouteStopList(response.route.stop);
                        busLocator.plotRouteStops(response.route.stop, routeOptions);
                        busLocator.settings.route = {
                            "routeLat": centerLat,
                            "routeLon": centerLon
                        };
                    }
                }
            });
        },


        setRouteStopList: function (stopsArr) {
            var template = '',
                templateData = '';

            _.templateSettings.variable = 'stops';

            template = _.template($('#stops-template').html());

            templateData = stopsArr;

            $('#stop_select').append(template(templateData));

            $('.container .content #routes .routeStops').show();
        },

        plotRouteStops: function (stopsArr, routeOptionsObj) {
            var image = 'images/red_stop.png',
                centerRoute = new google.maps.LatLng(routeOptionsObj.centerLat, routeOptionsObj.centerLon),
                mapOptions = {};

            mapOptions = {
                zoom: 13,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                center: centerRoute
            };

            busLocator.settings.map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

            for (var i = 0; i < stopsArr.length; i++) {
                if (!isNaN(stopsArr[i].attributes.lat) && !isNaN(stopsArr[i].attributes.lon)) {
                    var stopObj = {
                            'stopID': stopsArr[i].attributes.stopId,
                            'title': stopsArr[i].attributes.title,
                            'lat': stopsArr[i].attributes.lat,
                            'lon': stopsArr[i].attributes.lon
                        },
                        myLatLng = new google.maps.LatLng(stopObj.lat, stopObj.lon);

                    busLocator.settings.routeStops = [];

                    busLocator.settings.stops = new google.maps.Marker({
                        position: myLatLng,
                        map: busLocator.settings.map,
                        title: stopObj.title,
                        icon: image
                    });

                    busLocator.settings.routeStops.push(stopObj);

                } //End isNaN     
            }

            busLocator.setBusLocations(); //Set initial bus positions
        },

        setBusLocations: function () {
            $.ajax({
                async: false,
                cache: false,
                type: 'GET',
                url: '../app/?command=vehicleLocations&agency=' + busLocator.settings.agencyTag + '&route=' + busLocator.settings.routeNumber + '&t=',
                dataType: 'json',
                success: function (response) {
                    if (typeof response === 'object' && typeof response.vehicle !== 'undefined') {
                        var responseObj = response.vehicle;
                        if (_.isArray(responseObj)) {
                            for (var i = 0; i < responseObj.length; i++) {
                                if (!isNaN(responseObj[i].attributes.lat) && !isNaN(responseObj[i].attributes.lon)) {
                                    var lat = responseObj[i].attributes.lat,
                                        lon = responseObj[i].attributes.lon,
                                        busId = responseObj[i].attributes.id,
                                        myLatLon = new google.maps.LatLng(lat, lon),
                                        bus = {};

                                    bus = new google.maps.Marker({
                                        position: myLatLon,
                                        map: busLocator.settings.map,
                                        busId: busId
                                    });

                                    busLocator.settings.vehicles.push({
                                        'busId': busId,
                                        'marker': bus
                                    });

                                }
                            }
                        } else {
                            if (!isNaN(responseObj.attributes.lat) && !isNaN(responseObj.attributes.lon)) {
                                var lat = responseObj.attributes.lat,
                                    lon = responseObj.attributes.lon,
                                    busId = responseObj.attributes.id,
                                    myLatLon = new google.maps.LatLng(lat, lon),
                                    bus = {};

                                bus = new google.maps.Marker({
                                    position: myLatLon,
                                    map: busLocator.settings.map,
                                    busId: busId
                                });

                                busLocator.settings.vehicles.push({
                                    'busId': busId,
                                    'marker': bus
                                });
                            }
                        }

                        //Call function to update bus locations and next bus time if bus locations successfully loaded
                        busLocator.settings.timer = setInterval(function () { //Refresh marker locations every 20 seconds
                            busLocator.updateBusLocations();
                            if (busLocator.settings.displayNextTime) {
                                busLocator.updateNextBusTime();
                            }
                        }, 20000);

                        //Show stops on route
                        $('.container .selectRoutes .routeStops').show();
                    }
                }
            });
        },

        updateBusLocations: function () {

            $.ajax({
                async: false,
                cache: false,
                type: 'GET',
                url: '../app/?command=vehicleLocations&agency=' + busLocator.settings.agencyTag + '&route=' + busLocator.settings.routeNumber,
                dataType: 'json',
                success: function (response) {
                    if (typeof response === 'object') {
                        if (_.isArray(response.vehicle)) {
                            var lastTime = response.lastTime.attributes.time,
                                responseObj = response.vehicle;

                            for (var i = 0; i < responseObj.length; i++) {
                                var lat = '',
                                    lon = '',
                                    busId = '',
                                    lastTime = '',
                                    bus = '',
                                    updatedBus = '',
                                    busObj = '',
                                    vehicleObj = busLocator.settings.vehicles;

                                if (!isNaN(responseObj[i].attributes.lat) && !isNaN(responseObj[i].attributes.lon)) {
                                    lat = responseObj[i].attributes.lat;
                                    lon = responseObj[i].attributes.lon;
                                    busId = responseObj[i].attributes.id;
                                }

                                $.map(vehicleObj, function (obj, i) {
                                    if (obj.busId == busId) {
                                        obj.marker.setPosition(new google.maps.LatLng(lat, lon));
                                    }
                                });

                            }
                        } else {
                            var responseObj = response.vehicle,
                                lat = '',
                                lon = '',
                                busId = '',
                                lastTime = '',
                                bus = '',
                                updatedBus = '',
                                busObj = '',
                                vehicleObj = busLocator.settings.vehicles;

                            if (!isNaN(responseObj.attributes.lat) && !isNaN(responseObj.attributes.lon)) {
                                lat = responseObj.attributes.lat;
                                lon = responseObj.attributes.lon;
                                busId = responseObj.attributes.id;
                            }

                            $.map(vehicleObj, function (obj, i) {
                                if (obj.busId === busId) {
                                    obj.marker.setPosition(new google.maps.LatLng(lat, lon));
                                }
                            });
                        }
                    }
                }
            });
        },

        updateDirectionInfo: function () {
            var directionHTML = '';
            $.ajax({
                async: false,
                cache: false,
                type: 'GET',
                url: '../app/?command=direction&agency=' + busLocator.settings.agencyTag + '&stopId=' + busLocator.settings.selectedStop.stop,
                dataType: 'json',
                success: function (response) {
                        if (typeof response === 'object' && typeof response.directions.error === 'undefined') {
                            var predictionsArr = response.directions,
                                template = '',
                                templateData = '';

                            $('#direction_select option:gt(0)').remove();

                            _.templateSettings.variable = 'directions';

                            template = _.template($('#direction-template').html());

                            templateData = predictionsArr;

                            $('#direction_select').append(template(templateData));

                            $('.container .content #routes .routeDirection').show();

                        } else {
                            $('#direction_select option:gt(0)').remove();
                            $('.container .content #routes .routeDirection').hide();
                            alert(response.directions.error);
                        }
                    } //end success
            });
        },

        updateNextBusTime: function () {
            var minutes = '',
                seconds = '';
            $.ajax({
                async: false,
                cache: false,
                type: 'GET',
                url: '../app/?command=predictions&agency=' + busLocator.settings.agencyTag + '&stopId=' + busLocator.settings.selectedStop.stop + '&direction=' + encodeURIComponent(busLocator.settings.selectedDirection) + '&routeTitle=' + encodeURIComponent(busLocator.settings.routeTitle), //'../app/?command=predictions&agency='+busLocator.settings.agencyTag+'&stopId='+busLocator.settings.selectedStop
                dataType: 'json',
                success: function (response) {
                    if (typeof response === 'object') {
                        minutes = (typeof response.minutes === 'string') ? response.minutes : response.attributes.minutes;
                        seconds = (typeof response.seconds === 'string') ? response.seconds : response.attributes.seconds;
                    }
                    busLocator.settings.displayNextTime = true;
                    if (!isNaN(minutes)) {
                        if (minutes > 0) {
                            $('.container .countDown .busCountDown .busTime .minutes_until').empty().text(minutes);
                            $('.container .countDown .busCountDown  .busArriving').hide();
                            $('.container .countDown,.container .countDown .busCountDown,.container .countDown .busCountDown  .busTime').show();
                        } else if (minutes === 0 && seconds >= 0) {
                            $('.container .countDown .busCountDown  .busTime').hide();
                            $('.container .countDown .busCountDown  .busArriving').show();
                        } else {
                            $('.container .countDown .busCountDown  .busTime').hide();
                            $('.container .countDown .busCountDown  .busArriving').show();
                        }
                    } else {
                        $('.container .countDown .busCountDown').hide();
                        console.log('No bus information.')
                    }
                }
            });
        },

        zoomInToStopLocation: function () {
            busLocator.settings.map.setCenter(new google.maps.LatLng(busLocator.settings.selectedStop.lat, busLocator.settings.selectedStop.lon));
            busLocator.settings.map.setZoom(18);
        },

        zoomOutFromStopLocation: function () {
            busLocator.settings.map.setCenter(new google.maps.LatLng(busLocator.settings.route.routeLat, busLocator.settings.route.routeLon));
            busLocator.settings.map.setZoom(13);
        },

        emptyStops: function () {
            $('#stop_select option:gt(0), #direction_select option:gt(0)').remove();
            if (busLocator.settings.displayNextTime) {
                $('#minutes_until').empty();
                busLocator.settings.displayNextTime = false;
            }
        },

        resetOptions: function () {
            $('.container .content').find('.selectRoutes .routeStops, .routeDirection,.resetOptions,.getLocation,.countDown .busCountDown').hide();
            $('.container .content').find('.countDown .busCountDown .busTime .minutes_until').empty();
            $('#route_select').find('option:eq(0)').prop('selected', true);

            busLocator.emptyStops();

            clearInterval(busLocator.settings.timer);

            busLocator.settings.agencyTag = '';
            busLocator.settings.lastTime = '';
            busLocator.settings.map = '';
            busLocator.settings.mapOptions = '';
            busLocator.settings.route = '';
            busLocator.settings.routeNumber = '';
            busLocator.settings.routeTitle = '';
            busLocator.settings.stops = '';
            busLocator.settings.selectedStop = {};
            busLocator.settings.selectedDirection = '';
            busLocator.settings.timer = '';
            busLocator.settings.timerStarted = false;
            busLocator.settings.displayNextTime = false;
            busLocator.settings.vehicles = [];
            busLocator.settings.displayNextTime = false;

            busLocator.init();

        }
    };

    busLocator.init();

    //Get bus route stops
    $('.getRouteBtn').on('click', function (e) {
        if ($('#route_select option:selected').index()) {
            busLocator.settings.routeNumber = $('#route_select').val();
            $('.container .content .countDown').hide();
            $('.container .content #routes .routesAvailable .resetRoute').show();
            busLocator.emptyStops();
            busLocator.getRouteStops();
        } else {
            alert('Please select a route to continue.');
        }
    });

    //Get bus directions available for bus stop
    $('.getDirectionBtn').on('click', function (e) {
        if ($('#stop_select option:selected').index()) {
            busLocator.settings.selectedStop = {
                "stop": $('#stop_select option:selected').val(),
                "lat": $('#stop_select option:selected').attr('data-stopLat'),
                "lon": $('#stop_select option:selected').attr('data-stopLon')
            };
            $('.container .content #routes .routeStops .zoomToStop').show();
            $('.container .content .countDown').hide();
            busLocator.updateDirectionInfo();
        } else {
            alert('Please select a stop to continue.');
        }
    });

    //Show next bus arival time at selected stop 
    $('.showArivalTimeBtn').on('click', function (e) {
        if ($('#direction_select option:selected').index()) {
            busLocator.settings.selectedDirection = $('#direction_select').val();
            busLocator.updateNextBusTime();
        } else {
            alert('Please select a stop to continue.');
        }
    });

    //Reset options back to default
    $('.resetOptionsBtn').click(function (e) {
        e.preventDefault();
        $(this).parent().hide();
        busLocator.resetOptions();
    });

    //Zoom map in to selected bus stop
    $('.zoomInToStopBtn').on('click', function (e) {
        e.preventDefault();
        busLocator.zoomInToStopLocation();
    });

    $('.zoomOutStopBtn').on('click', function (e) {
        e.preventDefault();
        busLocator.zoomOutFromStopLocation();
    });

    //Show map when smartphone being used
    $('.showMapBtn').click(function (e) {
        e.preventDefault();
    });
})();
