// Inicializar el mapa
var map;
var directionsService, directionsRenderer;
var miubicacion, interval;

var locations = [
    {lat: -33.5131875,lng: -70.7434274},
    {lat: -33.5102713, lng: -70.7446505},
    {lat: -33.5122013, lng: -70.7466005},
    {lat: -33.5118882, lng: -70.7490976},
    {lat: -33.5085687, lng: -70.7441473},
    {lat: -33.4971285, lng: -70.7420424},
    {lat: -33.4724315, lng: -70.7544879},
    {lat: -33.516237, lng: -70.762556},
    {lat:-33.471286, lng: -70.627287},
] 

function initMap() {

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();

    // Centra el mapa en Maipu
        map = new google.maps.Map(
        document.getElementById("mapMain"), {zoom: 14, center: {lat: -33.5116635, lng: -70.7702235},
        mapTypeId: google.maps.MapTypeId.TERRAIN });
            
        directionsRenderer.setMap(map);
        
        var marker = locations.map(function(location, i) {
            return new google.maps.Marker({
            position: location,
            });
        });

        // Add a marker clusterer to manage the markers.
        var markerCluster = new MarkerClusterer(map, marker,
            {imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"});    
}


function initGps()
  {
    interval = setInterval(function(){
           
      if (navigator.geolocation)
      {
      navigator.geolocation.getCurrentPosition(updatePosition,showError);   
      }
      else{
        clearInterval(interval)
     }
    
    }, 3000)
    
  }

function updatePosition(position)
  {
  miubicacion = {
    lat: position.coords.latitude,
    lng: position.coords.longitude
    };
  updateGps(miubicacion);
  }


function showError(error)
  {
  if(sessionStorage.getItem("Permission")=="0")
  {
    return false
  }
  var mes = "";
  switch(error.code) 
    {
    case error.PERMISSION_DENIED:
      mes="El usuario a denegado el permiso de GPS";
      break;
    case error.POSITION_UNAVAILABLE:
      mes="La posicion esta inhabilitada";
      break;
    case error.TIMEOUT:
      mes="Se ha sobrepasado el tiempo limite para el GPS";
      break;
    case error.UNKNOWN_ERROR:
      mes="Error de GPS desconocido";
      break;
    }
    alert(mes)
    sessionStorage.setItem("Permission", "0");
    clearInterval(interval)
  }

function updateGps(miubicacion) {
  var markerGps = new google.maps.Marker({
    position: miubicacion,
    title:"Mi posicion"
  });
  if(this.miubicacionMarker){
    miubicacionMarker.setMap(null);; 
  }     
  markerGps.setMap(map);
  this.miubicacionMarker = markerGps;
}


function calcRoute() {
    var start = document.getElementById("start").value;
    var end = document.getElementById("start").value;;
  
    var request = {
      origin: miubicacion,
      destination: end,
      travelMode: "WALKING"
    };
    directionsService.route(request, function(result, status) {
      if (status == "OK") {
        directionsRenderer.setDirections(result);
      }
    });
}