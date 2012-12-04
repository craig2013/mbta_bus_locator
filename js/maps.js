var sURL = location.href;
var intRegex = /^\d+$/;
if(sURL.indexOf('route')!=-1){
  if(intRegex.test(sURL.substr(sURL.indexOf('=')+1))){
          var routeSelected = eval(sURL.substr(sURL.indexOf('=')+1));
  }
}

$(function(){
      directionsService = new google.maps.DirectionsService();	
                    
      var mapOptions = {
        zoom: 11,
        center: new google.maps.LatLng(42.358056,  -71.063611),//Center map on Boston, MA if no route selected
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);	  		
      directionsDisplay = new google.maps.DirectionsRenderer();
      directionsDisplay.setMap(map);
              
      
      //Get route list
      var routeListSelect='';   
      
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
              if(route_number){
                      showRoute(route_number);
              }
      });      
});		    
          

  function showRoute(routeNumber){
    //Map variables
    var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();
    var map;
    
    var centerLat = '', centerLon = '',startLon='', startLat='';	  
    //Begin display route code    			      		
    $.ajax({
            async: false,
            cache: false,			
            type: 'GET',
            url: 'http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=mbta&r='+routeNumber,
            dataType: 'xml',
            success: function(xml) {
                //Center map on route
                centerLat =  $(xml).find('route').attr('latMin');
                centerLon = $(xml).find('route').attr('lonMax');
                
                var centerRoute = new google.maps.LatLng(centerLat, centerLon);
                
                var mapOptions = {
                  zoom:15,
                  mapTypeId: google.maps.MapTypeId.ROADMAP,
                  center: centerRoute
                }
                map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
                
                //Place stop markers on map
                $(xml).find('stop').each(function(i){
                    if($(this).attr('lat') != null && $(this).attr('lon') != null){
                        lat = $(this).attr('lat');
                        lon = $(this).attr('lon');
                        title = $(this).attr('title');
                        
                        var myLatLng = new google.maps.LatLng(lat,lon);
                        var image = 'images/red_stop.png';
                        
                        var marker = new google.maps.Marker({
                            position: myLatLng,
                            map: map,
                            title:title,
                            icon: image
                        });				  
                        
                    }
                });
            }
    });
  }   