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
        if(events.image==undefined) imgsrc = "static/img/imgundefined.jpg";
        else imgsrc = events.image;
        detailEvent.innerHTML = 
        `<h1>${events.name}</h1>
        <img src='${imgsrc}' alt='caca'>
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
        if(event[i].image==undefined) imgsrc = "static/img/imgundefined.jpg";
        else imgsrc = event[i].image;
        listAll.innerHTML = 
            `<h1 onclick="centerEventClick(${i})">${event[i].name}</h1>
            <h2 id="cordsFilter">${event[i].id},${event[i].table}</h2>
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

function GetCookiesAsObject(){
    let cookies = {};
    document.cookie
    .split(';')
    .forEach(cookie => cookies = {
        ...cookies, 
        [cookie.split('=')[0].trim()]: cookie.split('=')[1].trim()
    });
    return cookies;
}

function SetCookie(name, value, expire = new Date().toUTCString()) {
    if(typeof name !== 'string' || name === '' || !name || !value)
        throw 'El nombre o valor no tienen el formato adecuado';
    if(typeof expire === 'number') {
        const date = new Date();
        date.setTime(date.getTime() + (expire * 24 * 60 * 60 * 1000));
        expire = date.toUTCString();
    }
    else if (typeof expire === 'object') {
        expire = expire.toUTCString();
    }
    document.cookie = `${name}=${value.toString()}; expires=${expire}; path=/;`;
}

function ExistsCookie(name) {
    return document.cookie.split(';').find(cookie => cookie.split('=')[0].trim() === name) ? true : false;
}

function GetCookie(name) {
    const cookie = document.cookie.split(';').find(cookie => cookie.split('=')[0].trim() === name);
    return cookie ? cookie.split('=')[1].trim() : undefined
    
}

function DeleteCookie(name){
    if(name !== '' || name !== undefined || name !== null)
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
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
            if(nearEvents[i2].id==filtro[i].textContent.split(',')[0] & nearEvents[i2].table==filtro[i].textContent.split(',')[1]){  
            li[i].style.display = "";
            flag++;
            }
        }
        if(flag==0){
            li[i].style.display = "none";
        }
    }
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