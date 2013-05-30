
var sURL = location.href;
var intRegex = /^\d+$/;
if(sURL.indexOf('route')!=-1){
  if(intRegex.test(sURL.substr(sURL.indexOf('=')+1))){
          var routeSelected = eval(sURL.substr(sURL.indexOf('=')+1));
  }
}

//Global variables
agency_tag='mbta';//Agency
stops=null;//Stops on map
vehicles=[];//Vehicles on map
routeListSelect='';//Route list

$(function(){
  //Map variables
  var mapOptions = {
   zoom: 11,
   center: new google.maps.LatLng(42.358056,  -71.063611),//Center map on Boston, MA if no route selected
   mapTypeId: google.maps.MapTypeId.ROADMAP
 };
 
 map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
 
  $.ajax({
          async: false,
          cache: false,			
          type: 'GET',
          url: 'http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=mbta',
          dataType: 'xml',
          success: function(xml) {
            $(xml).find('route').each(function(){				
              routeListSelect += '<option value="'+ $(this).attr('tag') + '" ';
              if(intRegex.test(routeSelected) && ($(this).attr('tag') == routeSelected))
                routeListSelect += 'selected="selected"';
                routeListSelect += '">'+ $(this).attr('title') +'</option>';
            });
          }					
      });	  	

      $('#route_select').append(routeListSelect);	
      
      $('#getRoute_btn').click(function(){
              var route_number = $('#route_select').val();
              
              if(route_number>=1){
                      showRoute(route_number);
              }else{
                alert("Please select a route to continue.")
              }
      });      
});		    
          

  function showRoute(routeNumber){
    
    centerLat = '', centerLon = '',startLon='', startLat='';	  
    //Begin display route code    			      		
    $.ajax({
            async: false,
            cache: false,			
            type: 'GET',
            url: 'http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=mbta&r='+routeNumber,
            dataType: 'xml',
            success: function(xml) {
                //Center map on route
                centerLat = eval($(xml).find('route').attr('latMin'));
                centerLon = eval($(xml).find('route').attr('lonMin'));
                
                routeTitle = $(xml).find('route').attr('title');
                
                centerRoute = new google.maps.LatLng(centerLat, centerLon);
                
                mapOptions = {
                  zoom:14,
                  mapTypeId: google.maps.MapTypeId.ROADMAP,
                  center: centerRoute
                }
                map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
                
                $(xml).find('stop').each(function(i){//Place stop markers on map
                    if($(this).attr('lat') != null && $(this).attr('lon') != null){
                        lat = $(this).attr('lat');
                        lon = $(this).attr('lon');
                        title = $(this).attr('title');
                        
                        myLatLng = new google.maps.LatLng(lat,lon);
                        image = 'images/red_stop.png';
                        
                        stops = new google.maps.Marker({
                            position: myLatLng,
                            map: map,
                            title:title,
                            icon: image
                        });				  
                        
                    }
                });
                
                //drawRoutes(map, routeNumber, xml);

                setBusLocations(map, routeNumber, routeTitle);//Set initial bus positions
                
                setInterval(function(){//Refresh marker locations every 10 seconds
                     updateBusLocations(map, routeNumber, routeTitle);
                 }, 10000);        
            }
    });
  }
  
  function drawRoutes(m, r, x){
      routeCordinates = [];
      masterArray = new Array();
      $(x).find('path:gt(7), path:gt(12)').find('point').each(function(i){
        if($(this).attr('lat') != null && $(this).attr('lon') != null){
            lat = $(this).attr('lat');
            lon = $(this).attr('lon');
              routeCordinates.push(new google.maps.LatLng(lat, lon));
        }
      });
      
    busRoute = new google.maps.Polyline({
      path: routeCordinates,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 1
    });
    
    busRoute.setMap(m);
  }
  
  function setBusLocations(m, r, t){    
    $.ajax({
            async: false,
            cache: false,			
            type: 'GET',
            url: 'http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocations&a='+agency_tag+'&r='+r+'&t=',
            dataType: 'xml',
            success: function(xml){
                $(xml).find('vehicle').each(function(i){
                    if($(this).attr('lat') != null && $(this).attr('lon') != null){
                        lat = $(this).attr('lat');
                        lon = $(this).attr('lon');
                        busId = $(this).attr('id');
                                                
                        myLatLng = new google.maps.LatLng(lat,lon);
                        
                        bus = new google.maps.Marker({
                            position: myLatLng,
                            map: m,
                            id: busId
                        });
                        
                        vehicles.push(bus);                    
                    }
                });
            }
    });
  }
  
  function updateBusLocations(m, r, t){
    $.ajax({
            async: false,
            cache: false,			
            type: 'GET',
            url: 'feed_reader.php?transit_system='+agency_tag+'&root_number='+r, 
            dataType: 'xml',
            success: function(xml){
                $(xml).find('vehicle').each(function(i){
                    if($(this).attr('lat') != null && $(this).attr('lon') != null){
                        lat = $(this).attr('lat');
                        lon = $(this).attr('lon');
                        busId = $(this).attr('id');
                        
                        if(busId === vehicles[i].id){//Update existing bus locations based on vehicle id                            
                            vehicles[i].setPosition(new google.maps.LatLng(lat, lon));
                        }else{//Create new vehicle if id doesn't already exist
                            myLatLng = new google.maps.LatLng(lat,lon);
                            
                            bus = new google.maps.Marker({
                                position: myLatLng,
                                map: m,
                                id: busId
                            });
                            vehicles.push(bus);  
                        }
          
                    }
                });
            }
    });    
  }