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
document.getElementById("form-container").addEventListener("blur", (event) => {
    event.target.style.display = "none";
})

