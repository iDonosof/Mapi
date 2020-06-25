//Funcion que cierra el Drop menu del tipo de estilo del mapa al hacer click en la pantalla
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

// Funciones para crear todos los botones custom del mapa
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
  
      if(userPosition !== undefined){
        map.setCenter(userPosition);
        map.setZoom(14);
      }else
        alert("Por favor activa el gps o acepta el permiso para acceder a esta funcionalidad")
    });
  }
  
  function mapTypeControl(controlDiv, map){
    var typeButton = document.createElement('button');
    typeButton.className = 'dropbtn';
    typeButton.title = 'Seleciona la vista del mapa';
    typeButton.innerHTML = 'Tipo de mapa';
    controlDiv.appendChild(typeButton);
  
    var typeDiv = document.createElement('div');
    typeDiv.className = 'dropdown-content';
    typeDiv.id = 'myDropdown';
    typeButton.appendChild(typeDiv);
  
    var mapiA = document.createElement('a');
    mapiA.innerHTML = 'Mapi Map';
    typeDiv.appendChild(mapiA);
  
    var satelliteiA = document.createElement('a');
    satelliteiA.innerHTML = 'Satelital';
    typeDiv.appendChild(satelliteiA);
  
    typeButton.addEventListener('click', function() {
      document.getElementById("myDropdown").classList.toggle("show");
    });
    mapiA.addEventListener('click', function() {
      map.setMapTypeId('styleMap');
    });
    satelliteiA.addEventListener('click', function() {
      map.setMapTypeId('satellite');
    });
  }
  
  //Funcion que cierra el Drop menu del tipo de estilo del mapa al hacer click en la pantalla
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
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
        setTimeout(() => {      
          calcNearEvents(eventsList, userPosition, 3)
        }, 2000);
        
      }
      else{
        alert("Dispositivo incompatible con la funcion de GPS")
      }
      centerControl.removeChild(centercControlText);
      controlDiv.removeChild(centerControl);
      var obtaintGps = new obtainGpsControl(controlDiv, map);
    });
    controlDiv.appendChild(autocompleteItems);
    document.addEventListener('click', function() { 
      if(document.querySelector('.autocomplete-items'))document.querySelector('.autocomplete-items').remove() 
    }, false);
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
      openPanelR();
  });
}