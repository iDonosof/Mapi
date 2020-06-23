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

    if(miubicacion !== undefined){
      map.setCenter(miubicacion);
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
  
function searchBarControl(controlDiv) {
  const searchBarInput = document.createElement('input');
  searchBarInput.id = 'searchBarInput';
  searchBarInput.placeholder = 'Ingresa el nombre del evento';
  controlDiv.appendChild(searchBarInput);
  
  const searchBarButton = document.createElement('button');
  searchBarButton.id = 'searchBarButton';
  searchBarButton.innerHTML = 'Buscar';
  controlDiv.appendChild(searchBarButton);

  controlDiv.addEventListener('click', async function() {
    const searcherValue = document.querySelector('#searchBarInput').value;
    const results = await SearcherFetch(searcherAbortController);
  });

  controlDiv.addEventListener('keyup', async e => {
    if(!e.target.value || e.target.value === '') {
      return false;
    }
    searcherAbortController.abort();
    searcherAbortController = new AbortController();
    const results = await SearcherFetch(e.target.value);
    if(!results){
      return false;
    }
    if(document.querySelector('.autocomplete-items'))
      document.querySelector('.autocomplete-items').remove();
    const autocompleteItems = document.createElement('div');
    autocompleteItems.className = 'autocomplete-items';

    results.forEach(result => {
      const container = document.createElement('div');
      container.innerHTML = `<a href="#" onClick="console.log(${result.id}, '${result.table}')">${result.name}</a>`;
      autocompleteItems.appendChild(container);
    });
    controlDiv.appendChild(autocompleteItems);
    
  }, false);

  document.addEventListener('click', function() { if(document.querySelector('.autocomplete-items'))document.querySelector('.autocomplete-items').remove() }, false);
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