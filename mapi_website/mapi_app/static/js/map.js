var map, directionsService, directionsRenderer, miubicacion, htmlGoogle;

var chileBounds = {
  north: -17.2,
  south: -57,
  west: -79,
  east: -65 ,
};

//Mapa que inicializa el mapa, sus configuraciones y los servicios de direcciones.
function initMap() {
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  
  map = new google.maps.Map(
    document.getElementById("map"), {zoom: 11, center: {lat: -33.4688845, lng: -70.6654369},
    mapTypeId: 'styleMap',
    restriction: {
      latLngBounds: chileBounds,
      strictBounds: false,
    },
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: true,
    mapTypeControlOptions: {
      mapTypeIds: ['styleMap', 'satellite'],
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
    },
    streetViewControl: true,
  });

  directionsRenderer.setMap(map);

  map.mapTypes.set('styleMap', new google.maps.StyledMapType(styleMap, { name: 'Mapi Map' }));

  var centerControlDiv = document.createElement('div');
  var centerControl = new CenterControl(centerControlDiv, map);
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControlDiv);

  var openEventsDiv = document.createElement('div');
  var opendiv = new openEventsControl(openEventsDiv, map);
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(openEventsDiv);

  var searchControlDiv = document.createElement('div');
  searchControlDiv.id = 'searchBarControl';
  searchControlDiv.className = 'col-sm-8';
  var srcControl = searchBarControl(searchControlDiv, map);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchControlDiv);

  addEvents()
}


// Funcion para crear el boton de centrar, se crea el div contenedor, y un div dentro con el texto para mayor personalizacion
function obtainGpsControl(controlDiv, map) {

  var obtainGpsControl = document.createElement('div');
  obtainGpsControl.title = 'Pincha el boton para centrar tu ubicacion';
  obtainGpsControl.id = 'obtainGpsControl';
  controlDiv.appendChild(obtainGpsControl);

  var obtainGpsText = document.createElement('div');
  obtainGpsText.id = 'obtainGpsText';
  obtainGpsText.innerHTML = '<img id="iconGps" src="static/img/gps.png" alt="GPS img">';
  obtainGpsControl.appendChild(obtainGpsText);
  obtainGpsControl.addEventListener('click', function() {

    if(miubicacion !== undefined){
      map.setCenter(miubicacion);
      map.setZoom(14);
    }else
      alert("Por favor activa el gps o acepta el permiso para acceder a esta funcionalidad")
  });
}

function searchBarControl(controlDiv) {

  var searchBarInput = document.createElement('input');
  searchBarInput.id = 'searchBarInput';
  searchBarInput.title = 'Ingresa el nombre del evento';
  controlDiv.appendChild(searchBarInput);
 
  var searchBarButton = document.createElement('button');
  searchBarButton.id = 'searchBarButton';
  searchBarButton.title = 'Pincha para buscar el evento';
  searchBarButton.innerHTML = 'Buscar';
  controlDiv.appendChild(searchBarButton);

  searchBarButton.addEventListener('click', function() {
    alert("Busca tus eventos proximamente")
  });
}

function CenterControl(controlDiv, map) {

  var centerControl = document.createElement('div');
  centerControl.id = 'centerControl';
  centerControl.title = 'Pincha el boton para centrar tu ubicacion';
  controlDiv.appendChild(centerControl);

  var centercControlText = document.createElement('div');
  centercControlText.id = 'centercControlText';
  centercControlText.innerHTML = '<img id="iconGps" src="static/img/gps.gif" alt="GPS img">';
  centerControl.appendChild(centercControlText);
  centerControl.addEventListener('click', function() {

    alert("Por favor danos los permisos de ubicacion para poder mostrarte los eventos cerca de tu ubicacion y poder encontrarlos mas facil")
    if (navigator.geolocation ){
      navigator.geolocation.getCurrentPosition(setMyPosition,showError);
    }
    else{
      alert("Dispositivo incompatible con la funcion de GPS")
    }
    centerControl.removeChild(centercControlText);
    controlDiv.removeChild(centerControl);
    var obtaintGps = new obtainGpsControl(controlDiv, map);
  });
}

function openEventsControl(controlDiv, map) {

  var openEventsControl = document.createElement('div');
  openEventsControl.id = 'openEventsControl';
  openEventsControl.title = 'Pincha el boton para abrir el listado de eventos';
  controlDiv.appendChild(openEventsControl);

  var openEventsText = document.createElement('div');
  openEventsText.id = 'centercControlText';
  openEventsText.innerHTML = '<img id="iconEvents" src="static/img/events.png" alt="event list img">';
  openEventsControl.appendChild(openEventsText);

  openEventsControl.addEventListener('click', function() {
    calcNearEvents()
  });
}

// Funcion que agrega un rango en el marcador de posicion
function rangoGps(){
  var cityCircle = new google.maps.Circle({
    strokeColor: '#7dcdcd',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#7dcdcd',
    fillOpacity: 0.35,
    map: map,
    center: miubicacion,
    radius: 1000
  });  
}

// Funcion que trae las cordenadas desde la api y las coloca en el mapa, junto con la animacion bounce y se le agrega una funcion click para abrir tarjeta
function addEvents(){
  var groupMarkers = [];
  var markerEvents;
  fetch('http://127.0.0.1:8000/api/events/list')
  .then( res => res.json())
  .then(events => {

    for (var i = 0; i < events.length; i++) {       

      LatLng = [{lat: parseFloat(events[i].latitude), lng: parseFloat(events[i].longitude)}]

      markerEvents = new google.maps.Marker({
          id: events[i].id,
          position: LatLng[0],
          title:"Mi posicion",
          map: map 
      });

      markerEvents.addListener('click', function () {
        openPanel();
      });
      groupMarkers.push(markerEvents)
    }

    var markerCluster = new MarkerClusterer(map, groupMarkers,
      {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
  }) 
}


// Funcion que abre y cierra la tarjeta de evento al hacerle click
function openPanel(){
  document.getElementById("menuPanel").style.width="100%";
}
function cerrarPanel(){
  document.getElementById("menuPanel").style.width="0%";
}

function setMyPosition(position)
  {
    miubicacion = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    var markerGps = new google.maps.Marker({
      position: miubicacion,
      title:"Mi posicion"
    });

    markerGps.setMap(map);
    map.setCenter(miubicacion);
    map.setZoom(14);
    rangoGps()
  }

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

// Funcion que calcula la ruta entre mi posicion del gps y la del evento, luego hace visible el boton de ruta para abrir google maps con la ruta creada
function calcRoute(i) {  
    var start = miubicacion;
    var end = events[i].LatLng[0];
    var request = {
      origin: start,
      destination: end,
      travelMode: "DRIVING"
    };
    if(miubicacion !== undefined){
      htmlGoogle = `https://www.google.com/maps/dir/?api=1&origin=${start.lat},${start.lng}&destination=${end.lat},${end.lng}`;

      document.querySelector("#controlText").style.visibility="visible";
      document.querySelector("#controlUI").style.visibility="visible";

      directionsService.route(request, function(result, status) {
        if (status == "OK") {
          directionsRenderer.setDirections(result);
        }
      });
    } else{
      alert("No tenemos acceso a tu ubicacion aun, revisa que hayas dado permiso al GPS para usar esta funcion")
    }
}

// function calcNearEvents(){

//   const R = 6371;

//   fetch('http://127.0.0.1:8000/api/events/list')
//   .then( res => res.json())
//   .then(events => {

//     for (var i = 0; i < events.length; i++) {  

//       const lat2 = parseFloat(events[i].latitude);
//       const lon2 = parseFloat(events[i].longitude);
//       const lat1 = miubicacion.lat;
//       const lon1 = miubicacion.lng;

//       const radiolat1 = lat1 * Math.PI/180;
//       const radiolat2 = lat2 * Math.PI/180;
//       const dlat = (lat2-lat1) * Math.PI/180;
//       const dlon = (lon2-lon1) * Math.PI/180;
    
//       const a = Math.sin(dlat/2) * Math.sin(dlat/2) + Math.cos(radiolat1) * Math.cos(radiolat2) * Math.sin(dlon/2) * Math.sin(dlon/2);
    
//       const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
//       const d = R * c;

//         var mlat = map.markers[i].position.lat();
//         var mlng = map.markers[i].position.lng();
        
//         var dLat  = rad(mlat - lat);
//         var dLong = rad(mlng - lng);

//         var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(lat)) * Math.cos(rad(lat)) * Math.sin(dLong/2) * Math.sin(dLong/2);

//         var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//         var d = R * c;
      
//     }
//   })
// }