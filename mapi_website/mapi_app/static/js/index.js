var map, userPosition;
var nearEvents = [], eventsList = [], allEventsMarkers = [], allEventsDetail = [];
var chileBounds = {
  north: -17.2,
  south: -57,
  west: -79,
  east: -65 ,
};

let searcherAbortController = new AbortController();

// Carga y guarda los datos de posicionamiento de todos los eventos en allEventsMarkers
fetch('http://127.0.0.1:8000/api/events/marks-list')
.then( res => res.json())
.then(events => {
  eventsList = events;
});

//Carta todos los detalles del evento para listar
fetch('http://127.0.0.1:8000/api/events/list')
.then( res => res.json())
.then(events => {  
  allEventsDetail = events;
});

//Todo lo que este dentro del onload sera realizado cuando este cargada la pagina
window.onload = function() {
  initMap();
}

function SearcherFetch(text) {
  return fetch('/api/search', {
    method: 'POST',
    headers: new Headers({
      'X-CSRFToken': GetCookie('csrftoken'),
      'Content-Type': 'application/json;charset=UTF-8'
    }),
    body: JSON.stringify({ words: text }),
    signal: searcherAbortController.signal
  })
  .then(response => response.ok ? response.json() : false)
  .catch(err => err.name !== 'AbortError' ? console.log(err) : false);
}