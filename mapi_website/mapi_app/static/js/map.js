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


// Funcion que abre y cierra la tarjeta de evento al hacerle click
function openPanel(customInfo){
  document.getElementById("menuPanel").style.width="50%";
  document.getElementById("map").style.width="50%";
  document.getElementById("map").style.marginLeft="50%";
  document.getElementById("map").style.transition= "all 1s";
  showDetailEvent(customInfo, ".panelContent", 0, "detailevent")
}
function closePanel(){
  document.getElementById("menuPanel").style.width="0%";
  document.getElementById("map").style.width="100%";
  document.getElementById("map").style.marginLeft="0";
  document.getElementById("map").style.transition= "all 1s";
  setTimeout(function(){
    detailContent = document.querySelector(".panelContent");
    detail = detailContent.querySelector("#detailEvent");
    detailContent.removeChild(detail);
  }, 1000); 
}

// Funcion que abre y cierra la lista de eventos cercanos o todos al hacerle click
function openPanelR(){
  var detailContent = document.querySelector(".panelContent");
  var detail = detailContent.querySelector("#detailEvent");
  document.getElementById("menuPanel").style.width="0%";
  document.getElementById("map").style.width="100%";
  document.getElementById("map").style.marginLeft="0";
  document.getElementById("menuPanelR").style.width="100%";
  showAllEvents(allEventsDetail, ".eventListTable", "listEvents");
}

function closePanelR(){
  document.getElementById("menuPanelR").style.width="0%";
  setTimeout(function(){
    card = document.querySelector(".eventListTable");
    card.querySelectorAll('*').forEach(n => n.remove());
  }, 1000); 

}

//Funcion que al clickear el titulo del evento lo centra en el mapa
function centerEventClick(lng, lat){
  closePanelR()
  LatLng = [{lat: parseFloat(lat), lng: parseFloat(lng)}]
  latE = lat;
  lngE = lng;

  map.setCenter(LatLng[0]);
  map.setZoom(18);

  for (i = 0; i < groupMarkers.length; i++){
    
    if(latE===parseFloat(groupMarkers[i].customInfo.split(',')[2]) & lngE===parseFloat(groupMarkers[i].customInfo.split(',')[3]) ){
      groupMarkers[i].setAnimation(google.maps.Animation.BOUNCE);
      eventCircle = new google.maps.Circle({
        strokeWeight: 0,
        fillColor: 'red',
        fillOpacity: 0.35,
        map: map,
        center: {lat: parseFloat(groupMarkers[i].customInfo.split(',')[2]), lng: parseFloat(groupMarkers[i].customInfo.split(',')[3])},
        radius: 40
      });  
      resetMarker(groupMarkers, i, eventCircle)
    }
  }
}

//Funcion que quita la animacion y circulo en 4 segundos
function resetMarker(mark, i, eventCircle){
  setTimeout(() => {      
    eventCircle.setMap(null);
    mark[i].setAnimation(null); 
  }, 4000);
}

// Funcion que filtra los eventos en la lista por nombre
function nameFilterEvent() {
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById("filterInputName");
  filter = input.value.toUpperCase();

  ul = document.getElementsByClassName("eventListTable");
  li = ul[0].getElementsByTagName("li");
  
  for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("h1")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
  }
}

// Funciones para filtar los eventos por tipo de evento
function buttonFilterEvent(type) {
  
  var filter, ul, li, i, txtValue, txtValue1, txtValue2;
  filter = type.toUpperCase();
  input = document.getElementById("filterInputName");
  input.value = '';
  ul = document.getElementsByClassName("eventListTable");
  li = ul[0].getElementsByTagName("li");

    for (i = 0; i < li.length; i++) {
      
      p = li[i].getElementsByTagName("p")[1];
      p2 = li[i].getElementsByTagName("p")[2];
      
      txtValue = p.textContent.split(':')[1];
      txtValue2 = p2.textContent.split(':')[1];
      txtValue1 = txtValue.split('-')[0];
      txtValue2 = txtValue2.split('-')[0];

      if (txtValue1.toUpperCase().indexOf(filter) > -1 || txtValue2.toUpperCase().indexOf(filter) > -1)  {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
      if (filter=="ALL"){
        li[i].style.display = "";
      }
    }
}

//Funcion para filtrar los eventos cercanos en la lista
function buttonFilterNearEvent(){
  var ul = document.getElementsByClassName("eventListTable");
  var filtro = ul[0].getElementsByTagName("h2");
  var li = ul[0].getElementsByTagName("li");
  var name = ul[0].getElementsByTagName("h1");
  for (i = 0; i < li.length; i++){
    var flag=0;
    for (i2 = 0; i2 < nearEvents.length; i2++){
      if(nearEvents[i2].latitude===filtro[i].textContent.split(',')[1] & nearEvents[i2].longitude===filtro[i].textContent.split(',')[0]){
        li[i].style.display = "";
        console.log(name[i]);
        flag++;
      }
    }
    if(flag==0){
      li[i].style.display = "none";
    }
  }
}