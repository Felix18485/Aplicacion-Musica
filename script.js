//Evento que se encarga de mostrar el formulario y ponerle el foco al pulsar el boton añadir
document.getElementById("add").addEventListener("click", () => {
    document.getElementById("form-container").style.display = "flex";
    document.getElementById("form-container").focus();
})

//Evento que se encarga de ocultar el formulario al hacer click en cerrar
document.getElementById("btn-cerrar").addEventListener("click", () => {
    document.getElementById("form-container").style.display = "none";
})

//Evento que se encarga de ocultar el formulario al clickar fuera del formulario
//document.getElementById("form-container").addEventListener("blur", (event) => {
//    event.target.style.display = "none";
//})

//Obtenemos la imagen de portada comparando las canciones
async function obtenerImagen(src) {
    try {
        const response = await fetch("http://informatica.iesalbarregas.com:7008/songs");
        if (!response.ok) {
            throw new Error("Error en la solicitud: " + response.statusText);
        }
        const data = await response.json();
        //Buscamos la cancion que coincida con el src de la cancion actual
        const song = data.find(element => element.filepath === src);
        if (song) {
            return song.cover;
        }
    } catch (error) {
        console.error("Error");
    }
}

//Obtenemos el titulo de la cancion comparando las canciones
async function obtenerTitulo(src) {
    try {
        const response = await fetch("http://informatica.iesalbarregas.com:7008/songs");
        if (!response.ok) {
            throw new Error("Error en la solicitud: " + response.statusText);
        }
        const data = await response.json();
        //Buscamos la cancion que coincida con el src de la cancion actual
        const song = data.find(element => element.filepath === src);
        if (song) {
            return song.title;
        }
    } catch (error) {
        console.error("Error");
    }
}

//Obtenemos el artista de la cancion comparando las canciones
async function obtenerArtista(src) {
    try {
        const response = await fetch("http://informatica.iesalbarregas.com:7008/songs");
        if (!response.ok) {
            throw new Error("Error en la solicitud: " + response.statusText);
        }
        const data = await response.json();
        //Buscamos la cancion que coincida con el src de la cancion actual
        const song = data.find(element => element.filepath === src);
        if (song) {
            return song.artist;
        }
    } catch (error) {
        console.error("Error");
    }
}

async function postCancion() {
    //Creamos un formData y lo llenamos con los archivos y textos necesarios
    let inputCancion = document.getElementById("inputCancion");
    let inputTitulo = document.getElementById("inputTitulo");
    let inputArtista = document.getElementById("inputAutor");
    let inputPortada = document.getElementById("inputImagen");
    let formData = new FormData();
    //El primer campo es la clave para enviarlo por post y el segundo el valor
    formData.append("music", inputCancion.files[0]);
    formData.append("title", inputTitulo.value);
    formData.append("artist", inputArtista.value);
    formData.append("cover", inputPortada.files[0]);

    try {
        const response = await fetch("http://informatica.iesalbarregas.com:7008/upload", {
            method: "POST",
            body: formData,
        })
        if (!response.ok) {
            throw new Error("Error en la solicitud: " + response.statusText);
        }
        //Ocultamos el formulario al subir un archivo
        document.getElementById("form-container").style.display = "none";
    } catch (error) {
        console.error(error);
    }
}

async function getCanciones() {
    try {
        const response = await fetch("http://informatica.iesalbarregas.com:7008/songs");
        if (!response.ok) {
            throw new Error("Error en la solicitud: " + response.statusText);
        }
        const data = await response.json();
        //Limpiamos el contenedor de la tabla
        document.getElementById("tbody").innerHTML = "";
        //Creamos la lista con todas las canciones
        crearLista(data);

    } catch (error) {
        console.error("Error");
    }
}

//Funcion que formatea los segundos de la cancion a minutos y segundos
function formatearTiempo(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
}

//Funcion que actualiza la barra de tiempo
function addOnTime() {
    //ontimeupdate es un evento que se ejecuta cada vez que cambia el tiempo actual de la cancion
    cancionActual.ontimeupdate = () => {
        //Obtenemos el tiempo actual de la cancion y su duracion
        const currentTime = cancionActual.currentTime;
        const duracion = cancionActual.duration;
        //Multiplicamos por 100 para que nos de un valor entero entre 1 y 100 es decir
        //que si el tiempo actual es 0.5 por 100 seria 50
        document.getElementById("barraProgreso").value = (currentTime / duracion) * 100;
        document.getElementById("tiempo").textContent = formatearTiempo(currentTime);
        document.getElementById("duracion").textContent = formatearTiempo(duracion);
        //En el caso de que la cancion haya acabado pasamos a la siguiente cancion
        if (cancionActual.ended) {
            saltarCancion();
        }
    }
}

//Funcion que actualiza la barra de tiempo, portada, artista y cancion
async function actualizarBarra() {
    document.getElementById("icon-play").setAttribute("class", "fas fa-pause");
    document.getElementById("portada").innerHTML = "";
    let portada = document.createElement("img");
    //Ponemos await porque es una funcion asincrona
    const cover = await obtenerImagen(cancionActual.src)
    const title = await obtenerTitulo(cancionActual.src);
    const artist = await obtenerArtista(cancionActual.src);
    portada.src = cover;
    document.getElementById("portada").append(portada);
    document.getElementById("cancionActual").textContent = title;
    document.getElementById("artistaActual").textContent = artist;
    cancionActual.volume = document.getElementById("barraVolumen").value;
}

//Funcion que añade el evento onended a la cancion actual
function saltarCancion() {
    //El evento onended se dispara cada vez que acaba una cancion
    cancionActual.onended = () => {
        if (aleatorio === false) {
            let indice = canciones.findIndex(cancion => cancion === cancionActual);
            if (indice < canciones.length - 1) {
                cancionActual = canciones[indice + 1];
                cancionActual.play();
            } else if (indice === canciones.length - 1) {
                cancionActual = canciones[0];
                cancionActual.play();
            }
        } else {
            let numeroAleatorio = Math.floor(Math.random() * canciones.length - 1);
            cancionActual = canciones[numeroAleatorio];
            cancionActual.play();
        }
        addOnTime();
        actualizarBarra();
    }
}

//Array que almacena todas las canciones
let canciones = [];
//Cancion que se esta reproduciendo
let cancionActual;
//Variable que determina si el modo aleatorio esta activo o no
let aleatorio = false;

//Funcion que añade una cancion a una lista de favoritos y lo guarda en localStorage
function addFavoritos(src) {
    //Recuperamos la lista de canciones favoritas de localStorage
    let favoritos = JSON.parse(localStorage.getItem('canciones'));
    //Si la lista de favoritos esta vacia la inicializamos
    if (favoritos === null) {
        favoritos = [];
    }

    //Booleano que utilizaremos para poner un icono u otro
    let favorito = false;
    //Guardamos la cancion en favoritos si no estaba ya
    if (!favoritos.includes(src)) {
        favoritos.push(src);
        localStorage.setItem("canciones", JSON.stringify(favoritos));
        favorito = true;
    } else {
        //Buscamos el indice que tiene la cancion en la lista
        let indice = favoritos.findIndex(cancion => cancion === src);
        //Elminimaos la cancion del array
        favoritos.splice(indice, 1);
        //Volvemos a subir el array sin la cancion
        localStorage.setItem("canciones", JSON.stringify(favoritos));
    }
    return favorito;
}

//Funcion que recupera la lista de favoritos de localStorage y lo guarda en un array
async function crearListaFavoritos() {
    //Recuperamos la lista de canciones de localStorage
    let favoritos = JSON.parse(localStorage.getItem('canciones'));
    //Array que almacenara las canciones favoritas
    let cancionesFavoritas = [];
    try {
        const response = await fetch("http://informatica.iesalbarregas.com:7008/songs");
        if (!response.ok) {
            throw new Error("Error en la solicitud: " + response.statusText);
        }
        const data = await response.json();
        //Recorremos la lista de favoritos del localStorage
        for (let indice = 0; indice < favoritos.length; indice++) {
            //Guardamos en el array cada cancion que encontramos en la api que coincidan los src
            let song = data.find(element => element.filepath === favoritos[indice]);
            cancionesFavoritas.push(song);
        }
        //Limpiamos la tabla de canciones
        document.getElementById("tbody").innerHTML = "";
        //Mostramos las canciones favoritas
        crearLista(cancionesFavoritas);
    } catch (error) {
        console.error("Error");
    }
}


//Funcion que rellena la lista de canciones de manera dinamica
function crearLista(data) {
    data.forEach(element => {
        //Creamos un objeto audio por cada cancion que venga de la api
        const cancion = new Audio(element.filepath);
        //Metemos cada cancion en el array de canciones
        canciones.push(cancion);
        let tbody = document.getElementById("tbody");
        let tr = document.createElement("tr");
        let tdPlay = document.createElement("td");
        let botonPlay = document.createElement("button");
        botonPlay.setAttribute("class", "play");
        let icon = document.createElement("i");
        icon.setAttribute("class", "fas fa-play");
        botonPlay.append(icon);
        //Añadimos un evento a cada uno de los botones play de la lista
        botonPlay.addEventListener("click", () => {
            //Cuando pulsemos el play recorremos todas las canciones y las paramos
            for (let indice = 0; indice < canciones.length; indice++) {
                canciones[indice].pause();
                canciones[indice].currentTime = 0;
            }
            //Despues de pararlas reproducimos la cancion elegida
            cancion.play();
            //Guardamos la cancion que se esta reproduciendo 
            cancionActual = cancion;
            //Ponemos el mismo volumen que esta seleccionado la barra de volumen
            cancionActual.volume = document.getElementById("barraVolumen").value;
            //Cambiamos el icono de la barra de reproduccion y ponemos la imagen de portada
            document.getElementById("icon-play").setAttribute("class", "fas fa-pause");
            document.getElementById("btn-pause").value = "Pause";
            document.getElementById("portada").innerHTML = "";
            let portada = document.createElement("img");
            portada.src = element.cover;
            document.getElementById("portada").append(portada);
            artistaActual = element.artist;
            tituloActual = element.title;
            document.getElementById("cancionActual").textContent = element.title;
            document.getElementById("artistaActual").textContent = element.artist;
            //Añadimos el evento para la barra de progreso y el tiempo
            addOnTime();
            //Añadimos el evento para saltar la cancion
            saltarCancion();
        })
        let tdTitulo = document.createElement("td");
        let tdArtista = document.createElement("td");
        let tdDuracion = document.createElement("td");
        let tdFavorito = document.createElement("td");
        let botonFav = document.createElement("button");
        botonFav.setAttribute("class", "fav");
        let i = document.createElement("i");
        //Recuperamos la lista de canciones favoritos
        let favoritos = JSON.parse(localStorage.getItem('canciones'));
        //En el caso de que la cancion este como favorito ponemos el icono del corazon relleno
        if (!favoritos.includes(cancion.src)) {
            i.setAttribute("class", "far fa-heart");
        } else {
            i.setAttribute("class", "fas fa-heart");
        }
        botonFav.append(i);
        botonFav.addEventListener("click", () => {
            let favorito = addFavoritos(cancion.src);
            //Pondremos un icono u otro dependiendo si la estamos añadiendo a favoritos o quitando
            if (favorito) {
                i.setAttribute("class", "fas fa-heart");
            } else {
                i.setAttribute("class", "far fa-heart");
            }
        })

        tdPlay.append(botonPlay);
        tdTitulo.textContent = element.title;
        tdArtista.textContent = element.artist;
        //Se utiliza onloadmetadata para mostrar la duracion una vez que se
        //han cargado los archivos
        cancion.onloadedmetadata = () => {
            let duracion = cancion.duration;
            //Transformamos la duracion en minutos y segundos
            let minutos = Math.floor(duracion / 60);
            let segundos = Math.round(duracion % 60);
            //Mostramos la duracion formateada
            tdDuracion.textContent = `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
        }
        tdFavorito.append(botonFav);

        tr.append(tdPlay, tdTitulo, tdArtista, tdDuracion, tdFavorito);
        tbody.append(tr);
    });
}
document.getElementById("btnPlay").addEventListener("click", () => {

    //Si la cancion estaba pausada la reproducimos y cambiamos el icono y viceversa
    if (cancionActual.paused) {
        cancionActual.play()
        document.getElementById("icon-play").setAttribute("class", "fas fa-pause");
        document.getElementById("btn-pause").value = "Pause";
    } else {
        cancionActual.pause();
        document.getElementById("icon-play").setAttribute("class", "fas fa-play");
        document.getElementById("btn-pause").value = "Play";
    }
})

//Funcion que para la cancion que se esta reproduciendo y reproduce la siguiente en el array
//Esta funcion tiene que ser asincrona porque llamamos a obtener imagen que tambien es asincrona
document.getElementById("btnNext").addEventListener("click", async () => {
    //Si el modo aleatorio esta activado paramos la cancion actual y reproducimos una aleatoria
    if (aleatorio === false) {
        for (let indice = 0; indice < canciones.length; indice++) {
            //Si el currentTime es > 0 implica que la cancion se esta reproduciendo asi que la paramos
            //y reproducimos la siguiente
            if (canciones[indice].currentTime > 0) {
                canciones[indice].pause();
                canciones[indice].currentTime = 0;
                cancionActual = canciones[indice + 1];
            }
        }
        //Si la cancion actual es undefined implica que has querido saltar la ultima cancion
        //en ese caso reproducimos la primera
        if (cancionActual === undefined) {
            cancionActual = canciones[0];
        }
    } else {
        let numeroAleatorio = Math.floor(Math.random() * canciones.length - 1);
        for (let indice = 0; indice < canciones.length; indice++) {
            //Si el currentTime es > 0 implica que la cancion se esta reproduciendo asi que la paramos
            //y reproducimos una aleatoria
            if (canciones[indice].currentTime > 0) {
                canciones[indice].pause();
                canciones[indice].currentTime = 0;
                cancionActual = canciones[numeroAleatorio];
            }
        }
    }
    //Añadimos el evento para la barra de progreso y el tiempo
    addOnTime();
    cancionActual.play();
    actualizarBarra();
})

document.getElementById("btnPrev").addEventListener("click", async () => {
    if (aleatorio === false) {
        for (let indice = 0; indice < canciones.length; indice++) {
            //Si el currentTime es > 0 implica que la cancion se esta reproduciendo asi que la paramos
            //y reproducimos la anterior
            if (canciones[indice].currentTime > 0) {
                canciones[indice].pause();
                canciones[indice].currentTime = 0;
                cancionActual = canciones[indice - 1];
            }
        }
        //Si la cancion actual es undefined implica que has querido saltar la ultima cancion
        //en ese caso reproducimos la ultima
        if (cancionActual === undefined) {
            cancionActual = canciones[canciones.length - 1];
        }
    } else {
        let numeroAleatorio = Math.floor(Math.random() * canciones.length - 1);
        for (let indice = 0; indice < canciones.length; indice++) {
            //Si el currentTime es > 0 implica que la cancion se esta reproduciendo asi que la paramos
            //y reproducimos una aleatoria
            if (canciones[indice].currentTime > 0) {
                canciones[indice].pause();
                canciones[indice].currentTime = 0;
                cancionActual = canciones[numeroAleatorio];
            }
        }
    }
    //Añadimos el evento para la barra de progreso y el tiempo
    addOnTime();
    cancionActual.play();
    actualizarBarra();
})

//Evento que sube o baja el volumen
document.getElementById("barraVolumen").addEventListener("input", () => {
    //Los valores del volumen van desde 0 a 1
    //Ponemos el valor que tiene el tipo range
    cancionActual.volume = event.target.value;
    if (cancionActual.volume === 0) {
        document.getElementById("muteIcon").setAttribute("class", "fas fa-volume-mute");
    } else if (cancionActual.volume > 0 && cancionActual.volume < 0.5) {
        document.getElementById("muteIcon").setAttribute("class", "fas fa-volume-down");
    } else {
        document.getElementById("muteIcon").setAttribute("class", "fas fa-volume-up");

    }
})

//Evento que mutea la cancion
document.getElementById("btnMute").addEventListener("click", () => {
    if (cancionActual.muted) {
        cancionActual.muted = false;
        document.getElementById("muteIcon").setAttribute("class", "fas fa-volume-down");
    } else {
        cancionActual.muted = true;
        document.getElementById("muteIcon").setAttribute("class", "fas fa-volume-mute");
    }
})

//Evento que pone la cancion en bucle
document.getElementById("btnLoop").addEventListener("click", () => {
    if (cancionActual.loop) {
        cancionActual.loop = false;
        event.target.style.color = "lightgray";
    } else {
        cancionActual.loop = true;
        event.target.style.color = "#1DB954";
    }
})

//Evento que pone las canciones en aleatorio
document.getElementById("btnRandom").addEventListener("click", () => {
    //Saca un numero aleatorio entre 0 y la cantidad de canciones
    if (aleatorio === false) {
        aleatorio = true;
        event.target.style.color = "#1DB954";
    } else {
        aleatorio = false;
        event.target.style.color = "lightgray";
    }
})



document.getElementById("btnFiltros").addEventListener("click", () => {
    if (window.getComputedStyle(acordeon).display === "none") {
        document.getElementById("acordeon").style.display = "flex";
    } else {
        document.getElementById("acordeon").style.display = "none";
    }
})



//Funcion que añade funcionalidad al boton de pause de la esquina superior derecha
document.getElementById("btn-pause").addEventListener("click", (event) => {
    //Si la cancion estaba pausada la reproducimos y cambiamos el icono y viceversa
    if (cancionActual.paused) {
        cancionActual.play()
        document.getElementById("icon-play").setAttribute("class", "fas fa-pause");
        event.target.value = "Pause";
    } else {
        cancionActual.pause();
        document.getElementById("icon-play").setAttribute("class", "fas fa-play");
        event.target.value = "Play";
    }
})

document.getElementById("barraProgreso").addEventListener("input", (event) => {
    let valorInput = parseFloat(event.target.value);
    cancionActual.currentTime = (valorInput / 100) * cancionActual.duration;
})

document.getElementById("btnFavoritos").addEventListener("click", crearListaFavoritos);
document.getElementById("btnTodos").addEventListener("click", getCanciones);
document.getElementById("subir").addEventListener("click", postCancion);
document.getElementById("inputTitulo").addEventListener("input", (event) => {
    //Expresion regular que solo permite entre 1 y 20 letras
    let regex = /^[a-zA-ZñÑ ]{1,20}$/;
    if (!regex.test(event.target.value)) {
        alert("El titulo no puede tener mas de 20 caracteres");
        //En el caso de que hay mas de 20 caracteres se elimina el ultimo caracter
        //y se actualiza el valor del input
        let inputModificado = event.target.value.substring(0, event.target.value.length - 1);
        event.target.value = inputModificado;
    }
    //Se iguala el valor del label con el del input
    label.textContent = inputTitulo.value;
})

document.getElementById("inputAutor").addEventListener("input", (event) => {
    //Expresion regular que solo permite entre 1 y 20 letras
    let regex = /^[a-zA-ZñÑ ]{1,20}$/;
    if (!regex.test(event.target.value)) {
        alert("El titulo no puede tener mas de 20 caracteres");
        //En el caso de que hay mas de 20 caracteres se elimina el ultimo caracter
        //y se actualiza el valor del input
        let inputModificado = event.target.value.substring(0, event.target.value.length - 1);
        event.target.value = inputModificado;
    }
    //Se iguala el valor del label con el del input
    label.textContent = inputTitulo.value;
})

//Mostramos la lista de canciones cuando abrimos la aplicacion
getCanciones();

