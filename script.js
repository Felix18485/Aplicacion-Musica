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

//Funcion que rellena la lista de canciones de manera dinamica
function crearLista(data) {

    data.forEach(element => {
        const cancion = new Audio(element.filepath);
        let tbody = document.getElementById("tbody");
        let tr = document.createElement("tr");
        let tdPlay = document.createElement("td");
        let botonPlay = document.createElement("button");
        botonPlay.setAttribute("class", "play");
        let icon = document.createElement("i");
        icon.setAttribute("class", "fas fa-play");
        botonPlay.append(icon);
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

document.getElementById("subir").addEventListener("click", postCancion);
getCanciones();