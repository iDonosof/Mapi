// Funcion que dibuja un circulo en el mapa 
function drawCircle(position, radius, color="black"){
    var circle = new google.maps.Circle({
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

// Funcion que calcula los eventos cercanos y los coloca en array nearEvents
function calcNearEvents(events, userPosition, range){
    const R = 6371;
    const pi = Math.PI;
    for (var i = 0; i < events.length; i++) {  
        const lat1 = userPosition.lat;
        const lon1 = userPosition.lng;
        const lat2 = parseFloat(events[i].latitude);
        const lon2 = parseFloat(events[i].longitude);
        const chLat = lat2-lat1;
        const chLon = lon2-lon1;
        const dLat = chLat*(pi/180);
        const dLon = chLon*(pi/180);
        const rLat1 = lat1*(pi/180);
        const rLat2 = lat2*(pi/180);
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(rLat1) * Math.cos(rLat2); 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        const d = R * c;
        if(d < range){
          nearEvents.push(events[i]);
        }
    }
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

// Funcion que calcula la ruta entre mi posicion del gps y la del evento, luego hace visible el boton de ruta para abrir google maps con la ruta creada
// function calcRoute(i) {  
//     var start = miubicacion;
//     var end = events[i].LatLng[0];
//     var request = {
//       origin: start,
//       destination: end,
//       travelMode: "DRIVING"
//     };
//     if(miubicacion !== undefined){
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

//Funcion que muestra el detalle del evento solicitado
function showDetailEvent(event, place, info, typeid){
    detail = document.querySelector(place)
    var id = event.split(',')[0];
    var typeEvent = event.split(',')[1];
    var selection = info;
fetch('http://127.0.0.1:8000/api/events/detail/'+typeEvent+'/'+id)
.then( res => res.json())
.then(events => {
    detailEvent = document.createElement("div");
    detailEvent.id = typeid;
    if(selection==0){
        detailEvent.innerHTML = 
        `<h1>${events.name}</h1>
        <b><p>Comuna:</b> ${events.commune}</p>
        <b><p>Tipo de evento:</b> ${typeEvent} - ${events.type}</p>
        <b><p>Descripcion:</b>  ${events.description}</p>
        <b><p>Direccion:</b>  ${events.address}</p>
        <b><p>Inicio:</b>  ${events.start_date}, ${events.start_time}</p>
        <b><p>Termino:</b>  ${events.ended_date}, ${events.ended_time}</p>`;
        }
    if(selection==1){
        detailEvent.innerHTML = 
        `<h1>${events.name}</h1>
        <img src='/media/workshops/2020/06/08/curso-online-pasteleria-reposteria_amp_primaria_1_1560502963.jpg' alt='caca'>
        <b><p>Comuna:</b> ${events.commune}</p>
        <b><p>Tipo de evento:</b> ${typeEvent} - ${events.type}</p>
        <b><p>Descripcion:</b>  ${events.description}</p>
        <b><p>Direccion:</b>  ${events.address}</p>
        <b><p>Inicio:</b>  ${events.start_date}, ${events.start_time}</p>
        <b><p>Termino:</b>  ${events.ended_date}, ${events.ended_time}</p>
        <b><p>Puntuaciones:</b></p>
        <p><img id="starsImg" src="static/img/5stars.png" alt="5 estrellas imagen"> = <b>${events.five_stars}</b></p>
        <p><img id="starsImg" src="static/img/4stars.png" alt="4 estrellas imagen"> = <b>${events.four_stars}</b></p>
        <p><img id="starsImg" src="static/img/3stars.png" alt="3 estrellas imagen"> = <b>${events.three_stars}</b></p>
        <p><img id="starsImg" src="static/img/2stars.png" alt="2 estrellas imagen"> = <b>${events.two_stars}</b></p>
        <p><img id="starsImg" src="static/img/1stars.png" alt="1 estrellas imagen"> = <b>${events.one_stars}</b></p>
        <h1>Comentarios de la gente</h1>
        <p>${events.comments}</p>`;
        }
      detail.appendChild(detailEvent);
    })
}

//Funcion que muestra con detalles todos los eventos en el lugar que uno seleccione
function showAllEvents(event, place, typeid){
    card = document.querySelector(place);
    for (var i = 0; i < event.length; i++) {       
        listAll = document.createElement('li');
        listAll.id = typeid;
        if(event[i].image=="undefined") imgsrc = 'static/img/imgundefined.jpg';
        else imgsrc = event[i].image;
        listAll.innerHTML = 
            `<h1 onclick="centerEventClick(${event[i].longitude}, ${event[i].latitude})">${event[i].name}</h1>
            <h2 id="cordsFilter">${event[i].longitude},${event[i].latitude}</h2>
            <img src='${imgsrc}' alt='caca'>
            <b><p>Comuna:</b> ${event[i].commune}</p>
            <b><p>Categoria de evento:</b>${event[i].table}</p>
            <b><p>Tipo de evento:</b>${event[i].type}</p>
            <b><p>Descripcion:</b>  ${event[i].description}</p>
            <b><p>Inicio:</b>  ${event[i].start_date}, ${event[i].start_time}</p>
            <b><p>Termino:</b>  ${event[i].ended_date}, ${event[i].ended_time}</p>`;
        card.appendChild(listAll);
    }
}
