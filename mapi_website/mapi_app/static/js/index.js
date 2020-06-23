var map, userPosition;
var nearEvents = [], eventsList = [], allEventsMarkers = [], allEventsDetail = [];
var chileBounds = {
  north: -17.2,
  south: -57,
  west: -79,
  east: -65 ,
};

var mark = {"id": 1, "name": "Vacunacion de mascotas", "latitude": "-33.4949035", "longitude": "-70.7572481", "table": "Evento", "icon": null};

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

addVariousMarks(eventsList)



