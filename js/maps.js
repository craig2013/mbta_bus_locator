var objBusLocator,
busLocator = {
  settings: {
    objBusLocator: '',
    vehicles: '',
    agencyTag: 'mbta',
    lastTime: '',
    map: '',
    mapOptions: '',
    route: '',
    routeNumber: '',
    routeTitle: '',
    stops: '',
    selectedStop: '',
    selectedDirection: '',
    displayNextTime: false
  },
  
  init: function (){
      objBusLocator = this;
     
      objBusLocator.settings.vehicles=new Array();
      objBusLocator.settings.agency_tag='mbta';
      
      objBusLocator.settings.mapOptions = {
        zoom: 11,
        center: new google.maps.LatLng(42.358056,  -71.063611),//Center map on Boston, MA if no route selected
        mapTypeId: google.maps.MapTypeId.ROADMAP        
      };
            
      objBusLocator.settings.map = new google.maps.Map(document.getElementById("map_canvas"), objBusLocator.settings.mapOptions);
      
      objBusLocator.setRouteList();
      
      $('#getRoute_btn').click(function(){
        objBusLocator.settings.routeNumber = $('#route_select').val();
        if(objBusLocator.settings.routeNumber>=1){
          objBusLocator.emptyStops();
          objBusLocator.showRoute(objBusLocator.settings.routeNumber);
        }else{
          alert("Please select a route to continue.")
        }       
      });
      
      $('#stop_select').change(function(){
        objBusLocator.settings.selectedStop = $('#stop_select').val();
        if(objBusLocator.settings.selectedStop>=1){
                objBusLocator.updateDirectionInfo();
        }else{
          alert("Please select a stop to continue.")
        }         
      });
      
      $('#getDirection_btn').click(function(){
        objBusLocator.settings.selectedDirection = $('#direction_select').val();
        if(objBusLocator.settings.selectedDirection!=0){
                objBusLocator.updateNextBusTime();  
        }else{
          alert("Please select a stop to continue.")
        }             
      });
  },
  
  setRouteList: function(){
    var routeListSelect = '';
    $.ajax({
            async: false,
            cache: false,			
            type: 'GET',
            url: 'http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=mbta',
            dataType: 'xml',
            success: function(xml) {
              $(xml).find('route').each(function(){				
                routeListSelect += '<option value="'+ $(this).attr('tag') + '" ';
                routeListSelect += '">'+ $(this).attr('title') +'</option>';
              });
            }  
    });          
  
    $('#route_select').append(routeListSelect);	    
  },
  
  showRoute: function(){
    var image = 'images/red_stop.png', objStops = '', objBusLocator = this;
    $.ajax({
            async: false,
            cache: false,			
            type: 'GET',
            url: 'http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a='+objBusLocator.settings.agencyTag+'&r='+objBusLocator.settings.routeNumber,
            dataType: 'xml',
            success: function(xml) {
                //Center map on route
                var centerLat = eval($(xml).find('route').attr('latMin'));
                var centerLon = eval($(xml).find('route').attr('lonMin'));
                
                objBusLocator.settings.routeTitle = $(xml).find('route').attr('title');
                
                var centerRoute = new google.maps.LatLng(centerLat, centerLon);
                
                mapOptions = {
                  zoom:14,
                  mapTypeId: google.maps.MapTypeId.ROADMAP,
                  center: centerRoute
                }
                objBusLocator.settings.map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
                
                $(xml).find('stop').each(function(i){//Place stop markers on map
                    if($(this).attr('lat') != null && $(this).attr('lon') != null){
                        var lat = $(this).attr('lat');
                        var lon = $(this).attr('lon');
                        var title = $(this).attr('title');
                        var stopID = $(this).attr('stopId');
                        var contentString = title;
                        var myLatLng = new google.maps.LatLng(lat,lon);

                        objBusLocator.settings.stops = new google.maps.Marker({
                            position: myLatLng,
                            map: objBusLocator.settings.map,
                            title: title,
                            icon: image
                        });
                        
                        //Create route stop select box
                        if(typeof stopID !== 'undefined')
                          objStops += '<option value="'+ stopID + '">'+title+'</option>';
 
        
                        var infowindow = new google.maps.InfoWindow({
                            content: contentString
                        });
                        
                        google.maps.event.addListener(objBusLocator.settings.stops, 'click', function() {
                          infowindow.open(objBusLocator.settings.map,this);
                        });
                        
                    }                            
                        
                });
                
          
               objBusLocator.setBusLocations();//Set initial bus positions
                
                setInterval(function(){//Refresh marker locations every 20 seconds
                     objBusLocator.updateBusLocations();
                     if(objBusLocator.settings.displayNextTime)
                        objBusLocator.updateNextBusTime();                     
                 }, 20000);
                
                $('#stop_select').append(objStops);
            }
    });   
    
  },
  
  setBusLocations: function(){
      $.ajax({
              async: false,
              cache: false,			
              type: 'GET',
              url: 'http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocations&a='+objBusLocator.settings.agency_tag+'&r='+objBusLocator.settings.routeNumber+'&t=',
              dataType: 'xml',
              success: function(xml){
                  $(xml).find('vehicle').each(function(i){
                      if($(this).attr('lat') != null && $(this).attr('lon') != null){
                          var lat = $(this).attr('lat');
                          var lon = $(this).attr('lon');
                          var busId = $(this).attr('id');
                                                  
                          var myLatLng = new google.maps.LatLng(lat,lon);
                          
                          var bus = new google.maps.Marker({
                              position: myLatLng,
                              map: objBusLocator.settings.map,
                              id: busId
                          });
                          
                          objBusLocator.settings.vehicles.push(bus);
  
  
                      }
                  });
                                
              }
      });    
  },
  
  updateBusLocations: function(){
    var lat = '', lon = '', busId = '', lastTime = '';
    $.ajax({
            async: false,
            cache: false,			
            type: 'GET',
            url: 'feed_reader.php?transit_system='+objBusLocator.settings.agency_tag+'&root_number='+objBusLocator.settings.routeNumber/*+'&last_time='+lastTime*/,
            dataType: 'xml',
            success: function(xml){
                lastTime = '';
                lastTime = $(xml).find('lastTime').attr('time');
                //console.log(lastTime);
                $(xml).find('vehicle').each(function(i){
                    if($(this).attr('lat') != null && $(this).attr('lon') != null){                        
                        lat = $(this).attr('lat');
                        lon = $(this).attr('lon');
                        busId = $(this).attr('id');
                        if(busId === objBusLocator.settings.vehicles[i].id){//Update existing bus locations based on vehicle id                            
                            objBusLocator.settings.vehicles[i].setPosition(new google.maps.LatLng(lat, lon));
                        }        
                    } 
                });
            }
    });    
  },
  
  updateDirectionInfo: function(){
    var objDirection='';
    $.ajax({
            async: false,
            cache: false,			
            type: 'GET',
            url: 'http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a='+objBusLocator.settings.agencyTag+'&stopId='+objBusLocator.settings.selectedStop,//mbta&stopId=74611
            dataType: 'xml',
            success: function(xml){
              $(xml).find('direction').each(function(i){
                objDirection+='<option value="'+$(this).attr('title')+'">'+$(this).attr('title')+'</option>';
              });
              
              $('#direction_select').append(objDirection);
            }
    });     
  },
  
  updateNextBusTime: function(){
    var minutes='';
    $.ajax({
            async: false,
            cache: false,			
            type: 'GET',
            url: 'http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a='+objBusLocator.settings.agencyTag+'&stopId='+objBusLocator.settings.selectedStop,//mbta&stopId=74611
            dataType: 'xml',
            success: function(xml){
              $(xml).find('direction').each(function(){
                  if($(this).attr('title')===objBusLocator.settings.selectedDirection){
                    minutes=$(this).find('prediction').first().attr('minutes');
                  }
              });
              minutes = minutes >= 1 ? minutes : 0;
              
              $('#minutes_until').empty();
              $('#minutes_until').append(minutes + ' minute(s).');
              objBusLocator.settings.displayNextTime = true;
            }
    });
  },
  emptyStops: function(){
    
    $('#stop_select').find('option:gt(0)').remove();
    $('#direction_select').find('option:gt(0)').remove();
     
    if(objBusLocator.settings.displayNextTime){
      $('#minutes_until').empty();
      objBusLocator.settings.displayNextTime = false;
    }     
  }
};


$(function(){
  busLocator.init();
});
   