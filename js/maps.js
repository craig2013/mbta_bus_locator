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
            selectedStop: '',
            selectedDirection: '',
            timer: '',
            timerStarted: false,
            displayNextTime: false
        },

        init: function () {
            busLocator.settings.vehicles = new Array();
            busLocator.settings.agencyTag = 'mbta';

            clearTimeout(busLocator.settings.timer);

            if (busLocator.settings.selectedStop < 1 && busLocator.settings.routeNumber < 1) {
                busLocator.settings.selectedStop = 0;
            }

            busLocator.settings.mapOptions = {
                zoom: 11,
                center: new google.maps.LatLng(42.358056, -71.063611), //Center map on Boston, MA if no route selected
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            busLocator.settings.map = new google.maps.Map(document.getElementById('map_canvas'), busLocator.settings.mapOptions);
            busLocator.setRouteList();

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

            $('.getDirectionBtn').on('click', function (e) {
                if ($('#stop_select option:selected').index()) {
                    busLocator.settings.selectedStop = $('#stop_select').val();
                    $('.container .content .countDown').hide();
                    busLocator.updateDirectionInfo();
                } else {
                    alert('Please select a stop to continue.');
                }
            });

            $('.showArivalTimeBtn').on('click', function (e) {
                if ($('#direction_select option:selected').index()) {
                    busLocator.settings.selectedDirection = $('#direction_select').val();
                    busLocator.updateNextBusTime();
                } else {
                    alert('Please select a stop to continue.');
                }
            });

            $('.resetOptionsBtn').click(function (e) {
                e.preventDefault();
                busLocator.resetOptions();
            });

            $('.getLocationBtn').click(function (e) {
                e.preventDefault();

                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(busLocator.findPosition, busLocator.errorPosition);
                } else {
                    error('not supported');
                }
            })

            $('.showMap').click(function (e) {
                e.preventDefault();
            });


        },

        findPosition: function (position) {
            var lat = position.coords.latitude,
                lon = position.coords.longitude;

            if (!isNaN(lat) && !isNaN(lon)) {
                $.ajax({
                    async: false,
                    cache: false,
                    type: 'GET',
                    url: 'get_location.php?lat=' + lat + '&lon=' + lon,
                    dataType: 'json',
                    success: function (response) {
                        if (typeof response === 'object' && response.status === 'OK') {
                            var streetNumber = (response.results[0].address_components[0].types[0] === 'street_number') ? response.results[0].address_components[0].long_name : '',
                                streetName = (response.results[0].address_components[1].types[0] === 'route') ? response.results[0].address_components[1].long_name : '',
                                city = (response.results[0].address_components[2].types[0] === 'locality') ? response.results[0].address_components[2].long_name : '',
                                state = (response.results[0].address_components[4].types[0] === 'administrative_area_level_1') ? response.results[0].address_components[4].short_name : '',
                                zipCode = (response.results[0].address_components[6].types[0] === 'postal_code') ? response.results[0].address_components[6].short_name : '',
                                formattedAddress = (typeof response.results[0].formatted_address === 'string' && response.results[0].formatted_address.length) ? response.results[0].formatted_address : '';

                            $('.yourAddress').empty().text(streetNumber + ' ' + streetName + ' ' + city + ', ' + state + ' ' + zipCode);

                            $('.container .content .options .getLocation .yourLocation').show();

                        }
                    }
                });
            }
        },

        errorPosition: function (e) {
            console.log('There was an error')
        },

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
                url: '../app/?command=direction&agency=' + busLocator.settings.agencyTag + '&stopId=' + busLocator.settings.selectedStop,
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
            var minutes = '';
            $.ajax({
                async: false,
                cache: false,
                type: 'GET',
                url: '../app/?command=predictions&agency=' + busLocator.settings.agencyTag + '&stopId=' + busLocator.settings.selectedStop + '&direction=' + encodeURIComponent(busLocator.settings.selectedDirection) + '&routeTitle=' + encodeURIComponent(busLocator.settings.routeTitle), //'../app/?command=predictions&agency='+busLocator.settings.agencyTag+'&stopId='+busLocator.settings.selectedStop
                dataType: 'json',
                success: function (response) {
                    if (typeof response === 'object') {
                        //var predictionTime = (_.isArray(response)) ? response.shift() : response;
                        minutes = (typeof response.minutes === 'string')? response.minutes : response.attributes.minutes;
                    }
                    busLocator.settings.displayNextTime = true;
                    if (!isNaN(minutes)) {
                        if (minutes > 0) {
                            $('.container .countDown .busCountDown .busTime .minutes_until').empty().text(minutes);
                            $('.container .countDown .busCountDown  .busArriving').hide();
                            $('.container .countDown,.container .countDown .busCountDown,.container .countDown .busCountDown  .busTime').show();
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
            busLocator.settings.selectedStop = '';
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
})();
