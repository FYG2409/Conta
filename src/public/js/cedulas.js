var tablaProcesos = document.getElementsByClassName("tablaProcesos")[0];
var nuevaTabla = tablaProcesos.cloneNode("tablaProcesos");
function newProcess() {
    var conteProcesos = document.getElementById("conteProcesos");
    console.log("Aqui");
    nuevaTabla.rows[3].removeAttribute("hidden");
    nuevaTabla.rows[3].children[2].firstElementChild.disabled = true;
    conteProcesos.insertAdjacentElement("beforeend", nuevaTabla);
}