(function(){
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
      selectedStop: '',
      selectedDirection: '',
      timmer: '',
      timmerStarted: false,
      displayNextTime: false
    },
    
    init: function (){
      var pageURL = document.URL;
      busLocator.settings.vehicles=new Array();
      busLocator.settings.agencyTag='mbta';
      
      if(busLocator.settings.selectedStop<1 && busLocator.settings.routeNumber<1){
        busLocator.settings.selectedStop = 0;
      }
      
      busLocator.settings.mapOptions = {
        zoom: 11,
        center: new google.maps.LatLng(42.358056,  -71.063611),//Center map on Boston, MA if no route selected
        mapTypeId: google.maps.MapTypeId.ROADMAP        
      };
      
      busLocator.settings.map = new google.maps.Map(document.getElementById("map_canvas"), busLocator.settings.mapOptions);
      
      busLocator.setRouteList();
      
      
      if(pageURL.indexOf('route')>=1){
        busLocator.loadRoute();
      }
      
      $('.getRouteBtn').click(function(){
        busLocator.settings.routeNumber = $('#route_select').val();
        if(busLocator.settings.routeNumber>=1){
          busLocator.emptyStops();
          busLocator.showRoute(busLocator.settings.routeNumber);
        }else{
          alert("Please select a route to continue.")
        }       
      });
      
      $('#stop_select').change(function(){
        busLocator.settings.selectedStop = $('#stop_select').val();
        if(busLocator.settings.selectedStop>=1){
                busLocator.updateURL();
                busLocator.updateDirectionInfo();
        }else{
          alert("Please select a stop to continue.")
        }         
      });
      
      $('.getDirectionBtn').click(function(){
        busLocator.settings.selectedDirection = $('#direction_select').val();
        if(busLocator.settings.selectedDirection!=0){
                busLocator.updateNextBusTime();  
        }else{
          alert("Please select a stop to continue.")
        }             
      });
      
      $('.resetOptionsBtn').click(function(e){
        e.preventDefault();
        busLocator.resetOptions();
      });
      
      $('.getLocationBtn').click(function(e){
        e.preventDefault();

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(busLocator.findPosition, busLocator.errorPosition);
        } else {
          error('not supported');
        }        
      })
      
      $('.showMap').click(function(e){
        e.preventDefault();
      });
    },
    
    findPosition: function(position){
      var lat = position.coords.latitude,
          lon = position.coords.longitude;
          
      if(!isNaN(lat) && !isNaN(lon)){
        $.ajax({
          async: false,
          cache: false,
          type: 'GET',
          url: 'get_location.php?lat='+lat+'&lon='+lon,
          dataType: 'json',
          success: function(response){
            if(typeof response === 'object' && response.status === 'OK'){
              var streetNumber = (response.results[0].address_components[0].types[0] === 'street_number')?response.results[0].address_components[0].long_name:'',
                  streetName = (response.results[0].address_components[1].types[0] === 'route')?response.results[0].address_components[1].long_name:'',
                  city = (response.results[0].address_components[2].types[0] === 'locality')?response.results[0].address_components[2].long_name:'',
                  state = (response.results[0].address_components[4].types[0] === 'administrative_area_level_1')?response.results[0].address_components[4].short_name:'',
                  zipCode = (response.results[0].address_components[6].types[0] === 'postal_code')?response.results[0].address_components[6].short_name:'',
                  formattedAddress = (typeof response.results[0].formatted_address === 'string' && response.results[0].formatted_address.length)?response.results[0].formatted_address:'';
                  
              $('.yourAddress').empty().text(streetNumber+' '+streetName+' '+city+', '+state+' '+zipCode);
              
              $('.container .content .options .getLocation .yourLocation').show();
                             
            }
          }
        });
      }
    },
    
    errorPosition: function(e){
      console.log('There was an error')
    },
    
    setRouteList: function(){
      $.ajax({
              async: false,
              cache: false,			
              type: 'GET',
              url: 'feed_reader.php?command=routeList&agency='+busLocator.settings.agencyTag,
              dataType: 'json',
              success: function(response){
                if(typeof response.route === 'object'){
                  var stopsHTML = '',
                      responseObj = response.route;
                  for(var i=0; i<responseObj.length; i++){
                      stopsHTML += '<option value="'+responseObj[i].attributes.tag+'">'+responseObj[i].attributes.title+'</option>';
                  }
                  
                  $('#route_select').append(stopsHTML);
                  $('.container .loading').hide();
                  $('.container .content,.container footer').show();
                }
              }
      });
    },
    
    showRoute: function(){
      var image = 'images/red_stop.png', objStops = '';
      $.ajax({
              async: false,
              cache: false,			
              type: 'GET',
              url: 'feed_reader.php?command=routeConfig&agency='+busLocator.settings.agencyTag+'&route='+busLocator.settings.routeNumber,
              dataType: 'json',
              success: function(response) {
                if(typeof response.route === 'object'){
                  var centerLat = response.route.attributes.latMin,
                      centerLon = response.route.attributes.lonMin,
                      centerRoute = new google.maps.LatLng(centerLat, centerLon),
                      mapOptions = {},
                      objStops = '',
                      responseObj = response.route.stop;
                      
                  busLocator.settings.routeTitle = response.route.attributes.title;
                      
                  mapOptions = {
                    zoom:14,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    center: centerRoute
                  };
                  
                  busLocator.settings.map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
                  busLocator.settings.routeStops = [];
                  
                  for(var i=0; i<responseObj.length; i++){
                    if(!isNaN(responseObj[i].attributes.lat) && !isNaN(responseObj[i].attributes.lon)){
                        var lat = responseObj[i].attributes.lat,
                            lon = responseObj[i].attributes.lon,
                            title = responseObj[i].attributes.title,
                            stopID = responseObj[i].attributes.stopId,
                            contentString = title,
                            myLatLng = new google.maps.LatLng(lat,lon);
                            
                        busLocator.settings.stops = new google.maps.Marker({
                            position: myLatLng,
                            map: busLocator.settings.map,
                            title: title,
                            icon: image
                        });
                        
                        busLocator.settings.routeStops.push(
                          {
                            "stopId": stopID,
                            "title": title,
                            "lat": lat,
                            "lon": lon
                          }
                        );
                        
                        //Create routde stop select box
                        objStops += (!isNaN(stopID))? '<option value="'+ stopID + '">'+title+'</option>' : '';                        
                        
                        var infowindow = new google.maps.InfoWindow({
                            content: contentString
                        });
                        
                        google.maps.event.addListener(busLocator.settings.stops, 'click', function() {
                          infowindow.open(busLocator.settings.map,this);
                        });                        
                    }
                  }
                  busLocator.setBusLocations();//Set initial bus positions
                  
                  $('#stop_select').append(objStops);
                  
                  $('.container .options').show();
                }
              }
      });   
      
    },
    
    setBusLocations: function(){
       $.ajax({
              async: false,
              cache: false,			
              type: 'GET',
              url: 'feed_reader.php?command=vehicleLocations&agency='+busLocator.settings.agencyTag+'&route='+busLocator.settings.routeNumber+'&t=',
              dataType: 'json',
              success: function(response){
                if(typeof response === 'object' && typeof response.vehicle !== 'undefined'){
                  var responseObj = response.vehicle;
                  if(Array.isArray(responseObj)){
                    for(var i=0; i<responseObj.length; i++){
                      if(!isNaN(responseObj[i].attributes.lat) && !isNaN(responseObj[i].attributes.lon)){
                        var lat = responseObj[i].attributes.lat,
                            lon = responseObj[i].attributes.lon,
                            busId = responseObj[i].attributes.id,
                            myLatLon = new google.maps.LatLng(lat,lon),
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
                  }else{
                      if(!isNaN(responseObj.attributes.lat) && !isNaN(responseObj.attributes.lon)){
                        var lat = responseObj.attributes.lat,
                            lon = responseObj.attributes.lon,
                            busId = responseObj.attributes.id,
                            myLatLon = new google.maps.LatLng(lat,lon),
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
                  busLocator.settings.timmer = setInterval(function(){//Refresh marker locations every 20 seconds
                       busLocator.updateBusLocations();
                       if(busLocator.settings.displayNextTime){
                          busLocator.updateNextBusTime();                     
                       }
                   }, 20000);
                  
                  //Update URL
                  busLocator.updateURL();
                  
                  //Show stops on route
                  $('.container .selectRoutes .routeStops').show();
                }else{
                  alert('No busses seem to be running.  Please select another root.');
                }
              }
       });
    },
    
    updateBusLocations: function(){
      
      $.ajax({
              async: false,
              cache: false,			
              type: 'GET',
              url: 'feed_reader.php?command=vehicleLocations&agency='+busLocator.settings.agencyTag+'&route='+busLocator.settings.routeNumber,
              dataType: 'json',
              success: function(response){
                if(typeof response === 'object'){
                  if(Array.isArray(response.vehicle)){
                    var lastTime = response.lastTime.attributes.time,
                        responseObj = response.vehicle;
                    
                    for(var i=0; i<responseObj.length; i++){
                      var lat = '',
                          lon = '',
                          busId = '',
                          lastTime = '',
                          bus = '',
                          updatedBus = '',
                          busObj = '',
                          vehicleObj = busLocator.settings.vehicles;
                          
                      if(!isNaN(responseObj[i].attributes.lat) && !isNaN(responseObj[i].attributes.lon)){
                        lat = responseObj[i].attributes.lat;
                        lon = responseObj[i].attributes.lon;
                        busId = responseObj[i].attributes.id;                        
                      }
                      
                      $.map(vehicleObj, function(obj,i){
                        if(obj.busId == busId){
                          obj.marker.setPosition(new google.maps.LatLng(lat, lon));
                        }
                      });
                      
                    }
                  }else{
                    var   responseObj = response.vehicle,
                          lat = '',
                          lon = '',
                          busId = '',
                          lastTime = '',
                          bus = '',
                          updatedBus = '',
                          busObj = '',
                          vehicleObj = busLocator.settings.vehicles;
                    //console.log(responseObj)
                    if(!isNaN(responseObj.attributes.lat) && !isNaN(responseObj.attributes.lon)){
                        lat = responseObj.attributes.lat;
                        lon = responseObj.attributes.lon;
                        busId = responseObj.attributes.id;
                    }
                    
                    $.map(vehicleObj, function(obj,i){
                      if(obj.busId == busId){
                        obj.marker.setPosition(new google.maps.LatLng(lat, lon));
                      }
                    });                    
                  }
                }
              }
      });
    },
    
    updateDirectionInfo: function(){
      var directionHTML='';
      $.ajax({
              async: false,
              cache: false,			
              type: 'GET',
              url: 'feed_reader.php?command=predictions&agency='+busLocator.settings.agencyTag+'&stopId='+busLocator.settings.selectedStop,
              dataType: 'json',
              success: function(response){
                if(typeof response === 'object'){
                  if(Array.isArray(response.predictions)){
                    var directionObj = response.predictions;
                    for(var i=0; i<directionObj.length; i++){
                      if(Array.isArray(directionObj[i].direction)){
                        for(var j=0; j<directionObj[i].direction.length; j++){
                          directionHTML += '<option value="'+directionObj[i].direction[j].attributes.title+'">'+directionObj[i].direction[j].attributes.title+'</option>';
                        }
                      }else{
                        if(typeof directionObj[i].direction === 'object'){ 
                          directionHTML += '<option value="'+directionObj[i].direction.attributes.title+'">'+directionObj[i].direction.attributes.title+'</option>';
                        }
                      }
                      $('#direction_select option:gt(0)').remove();
                      $('#direction_select').append(directionHTML);
                      busLocator.updateURL();
                      $('.container .selectRoutes .routeDirection').show();                      
                    }
                  }else{
                      directionHTML += '<option value="'+response.predictions.direction.attributes.title+'">'+response.predictions.direction.attributes.title+'</option>';
                      $('#direction_select option:gt(0)').remove();
                      $('#direction_select').append(directionHTML);
                      busLocator.updateURL();
                      $('.container .selectRoutes .routeDirection').show();
                  }
                }
              }
      });     
    },
    
    updateNextBusTime: function(){
      var minutes='';
      $.ajax({
              async: false,
              cache: false,			
              type: 'GET',
              url: 'feed_reader.php?command=predictions&agency='+busLocator.settings.agencyTag+'&stopId='+busLocator.settings.selectedStop,
              dataType: 'json',
              success: function(response){
                if(typeof response === 'object'){
                  if(Array.isArray(response.predictions)){
                    if(typeof response.predictions[0].direction === 'object'){
                      if(response.predictions[0].direction.attributes.title === busLocator.settings.selectedDirection){
                        minutes = response.predictions[0].direction.prediction.attributes.minutes;
                      }
                    }
                  }else{
                    if(response.predictions.direction.attributes.title === busLocator.settings.selectedDirection){
                      if(Array.isArray(response.predictions.direction.prediction)){
                        minutes = response.predictions.direction.prediction[0].attributes.minutes;
                      }else{
                        minutes = response.predictions.direction.prediction.attributes.minutes;
                      }               
                    }
                  }
                }
                busLocator.settings.displayNextTime = true;
                if(minutes>0){
                    $('.container .countDown .busCountDown .busTime .minutes_until').empty().append(minutes);
                    $('.container .countDown .busCountDown  .busArriving').hide();  
                    $('.container .countDown,.container .countDown .busCountDown  .busTime').show();                  
                }else{
                    $('.container .countDown .busCountDown  .busTime').hide();
                    $('.container .countDown .busCountDown  .busArriving').show();                  
                }
              }
      });
    },    
    
    emptyStops: function(){
      
      $('#stop_select option:gt(0), #direction_select option:gt(0)').remove();
      if(busLocator.settings.displayNextTime){
        $('#minutes_until').empty();
        busLocator.settings.displayNextTime = false;
      }     
    },
    
    resetOptions: function(){
      var newURL = window.location.protocol + "//" + window.location.host +  window.location.pathname;
      
      $('.container .content, .container footer').hide();
      $('.container .loading').show();
      
      busLocator.settings.mapOptions = {
        zoom: 11,
        center: new google.maps.LatLng(42.358056,  -71.063611),//Center map on Boston, MA if no route selected
        mapTypeId: google.maps.MapTypeId.ROADMAP        
      };
      
      busLocator.settings.map = new google.maps.Map(document.getElementById("map_canvas"), busLocator.settings.mapOptions);

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
      busLocator.settings.timmer = '';
      busLocator.settings.timmerStarted = false;
      busLocator.settings.displayNextTime = false;      
      busLocator.settings.vehicles = [];
      busLocator.settings.displayNextTime = false;
      
      $('.container .options').hide();
      
      window.location = newURL;
    },
    
    updateURL: function(){
      var routeTitle = busLocator.settings.routeTitle,
          routeStop = busLocator.settings.selectedStop,
          routeDirection = busLocator.settings.selectedDirection;
        
      if(typeof routeTitle === 'string' && routeTitle.length){
        routeTitle = routeTitle.replace(/ /g,'_');
      }
      
       if(typeof routeDirection === 'string' && routeDirection.length){
        routeDirection = routeDirection.replace(/ /g,'_');
      }     

      if((routeStop != 0) && (typeof routeTitle === 'string' && routeTitle.length) && (typeof routeDirection === 'string' && !routeDirection.length)){
        routie('/route/'+routeTitle+'/stop/'+routeStop);
      }else if((typeof routeDirection === 'string' && routeDirection.length) && (routeStop != 0 ) && (typeof routeTitle === 'string' && routeTitle.length)){
        routie('/route/'+routeTitle+'/stop/'+routeStop+'/direction/'+routeDirection);
      }else{
        routie('/route/'+routeTitle);
      }
    },
    
    loadRoute: function(){
      var pageURL = document.URL,
          routeInfo = pageURL.split('/route/')[1],
          stopAndDirection = '',
          stopOnly = '',
          directionOnly = '',
          route = '',
          stop = '',
          direction = '';
      
      if(routeInfo.indexOf('/stop/')){
        //Select route number
        if(typeof routeInfo.split('/stop/')[0] === 'string' && routeInfo.split('/stop/')[0].toString().length){
          route = $('#route_select option').filter(function(){
            return $(this).text() == routeInfo.split('/stop/')[0].toString().replace(/_/g,' ');
          }).prop('selected', true).val();
          if(!isNaN(route)){
            busLocator.settings.routeNumber = route;
            busLocator.showRoute();
          }
        }
        
        
        //Select route stop
        if(typeof routeInfo.split('/stop/')[1] === 'string' && routeInfo.split('/stop/')[1].toString().length){
          if(routeInfo.split('/stop/')[1].toString().indexOf('/direction/')){
            stopAndDirection = routeInfo.split('/stop/')[1];
            stopOnly = stopAndDirection.split('/direction/')[0];
            directionOnly = stopAndDirection.split('/direction/')[1];
          }else{
           stopOnly = routeInfo.split('/stop/')[1];
          }
          stop = $('#stop_select option').filter(function(){
            return $(this).val() == stopOnly;
          }).prop('selected', true).val();
          if(!isNaN(stop)){
            busLocator.settings.selectedStop = stop;
            busLocator.updateDirectionInfo();
          }           
        }
        
        //Select direction
        if(typeof directionOnly === 'string' && directionOnly.length){
          direction = $('#direction_select option').filter(function(){
            return $(this).text() == directionOnly.toString().replace(/_/g,' ');
          }).prop('selected', true).val();
          
          busLocator.settings.selectedDirection = direction;
          busLocator.updateNextBusTime();
        }
      }
    }
  };
  
  busLocator.init();
})();

