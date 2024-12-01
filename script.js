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
        console.log("exito");
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
        console.log(data);
        crearLista(data);

    } catch (error) {
        console.error("Error");
    }



}

//Array que almacena todas las canciones
let canciones = [];
//Cancion que se esta reproduciendo
let cancionActual;

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
            //Cambiamos el icono de la barra de reproduccion y ponemos la imagen de portada
            document.getElementById("icon-play").setAttribute("class", "fas fa-pause");
            document.getElementById("portada").innerHTML = "";
            let portada = document.createElement("img");
            portada.src = element.cover;
            document.getElementById("portada").append(portada);
            artistaActual = element.artist;
            tituloActual = element.title;
            document.getElementById("cancionActual").textContent = element.title;
            document.getElementById("artistaActual").textContent = element.artist;
        })
        let tdTitulo = document.createElement("td");
        let tdArtista = document.createElement("td");
        let tdDuracion = document.createElement("td");
        let tdFavorito = document.createElement("td");
        let botonFav = document.createElement("button");
        botonFav.setAttribute("class", "fav");
        let i = document.createElement("i");
        i.setAttribute("class", "far fa-heart");
        botonFav.append(i);

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
    } else {
        cancionActual.pause();
        document.getElementById("icon-play").setAttribute("class", "fas fa-play");
    }
})

//Obtenemos la imagen de portada comparando las canciones
async function obtenerImagen(src) {
    try {
        const response = await fetch("http://informatica.iesalbarregas.com:7008/songs");
        if (!response.ok) {
            throw new Error("Error en la solicitud: " + response.statusText);
        }
        const data = await response.json();
        console.log(data);
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
        console.log(data);
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
        console.log(data);
        //Buscamos la cancion que coincida con el src de la cancion actual
        const song = data.find(element => element.filepath === src);
        if (song) {
            return song.artist;
        }
    } catch (error) {
        console.error("Error");
    }
}

//Funcion que para la cancion que se esta reproduciendo y reproduce la siguiente en el array
//Esta funcion tiene que ser asincrona porque llamamos a obtener imagen que tambien es asincrona
document.getElementById("btnNext").addEventListener("click", async () => {
    for (let indice = 0; indice < canciones.length; indice++) {
        //Si el currentTime es > 0 implica que la cancion se esta reproduciendo
        if (canciones[indice].currentTime > 0) {
            canciones[indice].pause();
            canciones[indice].currentTime = 0;
            cancionActual = canciones[indice + 1];
        }
    }

    cancionActual.play();
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
})

document.getElementById("btnPrev").addEventListener("click", async () => {
    for (let indice = 0; indice < canciones.length; indice++) {
        //Si el currentTime es > 0 implica que la cancion se esta reproduciendo
        if (canciones[indice].currentTime > 0) {
            canciones[indice].pause();
            canciones[indice].currentTime = 0;
            cancionActual = canciones[indice - 1];
        }
    }
    cancionActual.play();
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
})




document.getElementById("subir").addEventListener("click", postCancion);
getCanciones();