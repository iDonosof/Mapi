var map, userPosition, eventCircle;
var nearEvents = [], eventsList = [], allEventsMarkers = [], allEventsDetail = [];
var chileBounds = {
  north: -17.2,
  south: -57,
  west: -79,
  east: -65 ,
};

// Carga y guarda los datos de posicionamiento de todos los eventos en allEventsMarkers
fetch('http://127.0.0.1:8000/api/events/marks-list')
.then( res => res.json())
.then(events => {
    eventsList = events;
}) 

//Carta todos los detalles del evento para listar
fetch('http://127.0.0.1:8000/api/events/list')
.then( res => res.json())
.then(events => {  
      allEventsDetail = events;
}) 

// Funcion que abre y cierra la tarjeta de evento al hacerle click
function openPanel(customInfo){
  document.getElementById("menuPanel").style.width="50%";
  document.getElementById("map").style.width="50%";
  document.getElementById("map").style.marginLeft="50%";
  document.getElementById("map").style.transition= "all 1s";
  showDetailEvent(customInfo, ".panelContent", 1, "detailevent")
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


