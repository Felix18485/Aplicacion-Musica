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
    } catch (error) {
        console.error("Error");
    }

}

document.getElementById("subir").addEventListener("click", postCancion);
getCanciones();