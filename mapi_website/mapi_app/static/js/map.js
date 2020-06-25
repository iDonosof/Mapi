//Mapa que inicializa el mapa, sus configuraciones y los servicios de direcciones.
function initMap() {
  map = new google.maps.Map(
    document.getElementById("map"), {zoom: 11, center: {lat: -33.4688845, lng: -70.6654369},
    mapTypeId: 'styleMap',
    restriction: {
      latLngBounds: chileBounds,
      strictBounds: false,
    },
    disableDefaultUI: true,
    zoomControl: true,
    streetViewControl: true,
  });

  map.mapTypes.set('styleMap', new google.maps.StyledMapType(styleMap, { name: 'Mapi Map' }));

  var centerControlDiv = document.createElement('div');
  CenterControl(centerControlDiv, map);
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControlDiv);

  var openEventsDiv = document.createElement('div');
  openEventsControl(openEventsDiv, map);
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(openEventsDiv);

  var searchControlDiv = document.createElement('div');
  mapTypeControl(searchControlDiv, map);
  searchControlDiv.id = 'searchBarControl';
  searchControlDiv.className = 'col-sm-8 autocomplete';
  searchBarControl(searchControlDiv, map);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchControlDiv);

}

// Funcion que calcula la ruta entre mi posicion del gps y la del evento, luego hace visible el boton de ruta para abrir google maps con la ruta creada
// function calcRoute(i) {  
//     var start = userPosition;
//     var end = events[i].LatLng[0];
//     var request = {
//       origin: start,
//       destination: end,
//       travelMode: "DRIVING"
//     };
//     if(userPosition !== undefined){
//       htmlGoogle = `https://www.google.com/maps/dir/?api=1&origin=${start.lat},${start.lng}&destination=${end.lat},${end.lng}`;

//       document.querySelector("#controlText").style.visibility="visible";
//       document.querySelector("#controlUI").style.visibility="visible";

//       directionsService.route(request, function(result, status) {
//         if (status == "OK") {
//           directionsRenderer.setDirections(result);
//         }
//       });
//     } else{
//       alert("No tenemos acceso a tu ubicacion aun, revisa que hayas dado permiso al GPS para usar esta funcion")
//     }
// }

// Funcion que dibuja un circulo en el mapa 
function drawCircle(position, radius, color="Blue"){
  eventCircle = new google.maps.Circle({
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.35,
      map: map,
      center: position,
      radius: radius
  });  
}

// Funcion que añade todos los eventos que se les da al mapa
function addVariousMarks(events){
  for (var i = 0; i < events.length; i++) {       
  LatLng = [{lat: parseFloat(events[i].latitude), lng: parseFloat(events[i].longitude)}]
  markerEvents = new google.maps.Marker({
      id: events[i].id,
      position: LatLng[0],
      title: events[i].name,
      map: map,
      type: events[i].table
  });
  markerEvents.customInfo = events[i].id+","+events[i].table +","+ events[i].latitude+","+ events[i].longitude;
  google.maps.event.addListener(markerEvents, 'click', function () {
      openPanel(this.customInfo);
  });
      allEventsMarkers.push(markerEvents)
  }
  var markerCluster = new MarkerClusterer(map, allEventsMarkers,
      {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
}

// Funcion que añade 1 marcador al mapa
function addOneMark(event){      
  LatLng = [{lat: parseFloat(event.latitude), lng: parseFloat(event.longitude)}]
  markerEvents = new google.maps.Marker({
      id: event.id,
      position: LatLng[0],
      title: event.name,
      map: map,
      type: event.table
  });
}

//Funcion que al clickear el titulo del evento lo centra en el mapa
function centerEventClick(i){
  closePanelR()
  LatLng = [{lat: parseFloat(eventsList[i].latitude), lng: parseFloat(eventsList[i].longitude)}]
  map.setCenter(LatLng[0]);
  map.setZoom(18);
  allEventsMarkers[i].setAnimation(google.maps.Animation.BOUNCE);
  drawCircle(LatLng[0], 100, "Blue");
  resetMarker(i);
}

//Funcion que quita la animacion y circulo en 4 segundos
function resetMarker(i){
  setTimeout(() => {      
      eventCircle.setMap(null);
      allEventsMarkers[i].setAnimation(null); 
  }, 4000);
}

function setMyPosition(position)
  {
    userPosition = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    var markerGps = new google.maps.Marker({
      position: userPosition,
      title:"Mi posicion"
    });

    markerGps.setMap(map);
    map.setCenter(userPosition);
    map.setZoom(14);
    drawCircle(userPosition, 1500, "cyan")
  }

// Funcion que muestra los errores del gps
function showError(error){
  var mes = "";
  switch(error.code) 
    {
    case error.POSITION_UNAVAILABLE:
      mes="La posicion esta inhabilitada";
      alert(mes)
      break;
    case error.TIMEOUT:
      mes="Se ha sobrepasado el tiempo limite de espera para el GPS";
      alert(mes)
      break;
    case error.UNKNOWN_ERROR:
      mes="Error de GPS desconocido";
      alert(mes)
      break;
    }
}