const nodo_Cuentas = 'Cuentas';
var cuentas = [];

//LLENAR SELECT CUENTAS
db.ref(nodo_Cuentas).once("value").then(function (snapshot) {
    snapshot.forEach(function (child) {
        cuentas.push(child.key);
    });
    llenaCuentas(document.getElementById("sConcepto"));
}, function (errorObject) {
    console.error(errorObject.code);
    });

function llenaCuentas(combo) {
    cuentas.forEach(function (key) {
        var opcion = document.createElement("option");
        opcion.text = key;
        combo.add(opcion);
    });
}

//AGREGA NUEVA FILA
const btnNuevaFila = document.getElementById("nuevaFila");
btnNuevaFila.addEventListener("click", function () {
    if (validaFila()) {
        nuevaFila();
    }
});

function nuevaFila() {
    //CREANDO ELEMENTOS PARA TABLA
    var tr = document.createElement("tr");
    var tdD = document.createElement("td");
    var tdC = document.createElement("td");
    var tdH = document.createElement("td");
    var tabla = document.getElementById("tablaDiario");

    //CREANDO ELEMENTOS INPUT DEBE
    var iDebe = document.createElement("input");
    iDebe.setAttribute("type", "number");
    iDebe.setAttribute("name", "debe");
    iDebe.setAttribute("placeholder", "Debe");
    //CREANDO ELEMENTO INPUT PARA CONCEPTO
    var iConcepto = document.createElement("select");
    iConcepto.setAttribute("type", "text");
    iConcepto.setAttribute("name", "concepto");
    //Enviando options a select de concepto
    llenaCuentas(iConcepto);
    //CREANDO ELEMENTO INPUT PARA HABER
    var iHaber = document.createElement("input");
    iHaber.setAttribute("type", "number");
    iHaber.setAttribute("name", "haber");
    iHaber.setAttribute("placeholder", "Haber");

    //AÑADIENDO INPUT A TABLA
    tdD.appendChild(iDebe);
    tdC.appendChild(iConcepto);
    tdH.appendChild(iHaber);

    //AÑADIENDO FILA A TABLA
    tr.appendChild(tdD);
    tr.appendChild(tdC);
    tr.appendChild(tdH);
    tabla.appendChild(tr);
}

function validaFila() {
    tabla = document.getElementById("tablaDiario");
    lonFilas = tabla.rows.length;
    //Trayendo valores de la ultima fila
    var debeTxt = tabla.rows[(lonFilas - 1)].getElementsByTagName("td")[0].firstElementChild.value;
    var conceptoS = tabla.rows[(lonFilas - 1)].getElementsByTagName("td")[1].firstElementChild;
    var haberTxt = tabla.rows[(lonFilas - 1)].getElementsByTagName("td")[2].firstElementChild.value;
    if (debeTxt === "") {
        if (haberTxt === "") {
            //Ambos vacios
            alert("Primero escribe un debe o haber");
            tabla.rows[(lonFilas - 1)].getElementsByTagName("td")[0].firstElementChild.focus();
            return false;
        } else {
            //Haber lleno, debe vacio
            return true;
        }
    } else if (haberTxt === "") {
        //debe lleno, haber vacio
        return true
    } else {
        //Ambos llenos
        alert("No puedes tener debe y haber en el mismo concepto");
        tabla.rows[(lonFilas - 1)].getElementsByTagName("td")[0].firstElementChild.focus();
        return false;
    }
}

//AGREGA NUEVO ASIENTO
const btnNuevoAsiento = document.getElementById('btnNuevoAsiento');
btnNuevoAsiento.addEventListener("click", function () {
    if (validaFila()) {
        if (validaAsiento()) {
            nuevoAsiento();
        }
    }
});

function nuevoAsiento() {
    //CREANDO ELEMENTOS PARA TABLA
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    var tabla = document.getElementById("tablaDiario");

    //PONIENDO ATRIBUTOS
    td.setAttribute("colspan", "3");

    //CREANDO P PARA INDICE
    var iIndice = document.createElement("p");
    iIndice.setAttribute("name", "indice");

    //buscando y poniendo indice
    var indice = document.getElementsByName("indice").length + 1;
    iIndice.innerText = indice;

    //AÑADIENTO A LA TABLA
    td.appendChild(iIndice);
    tr.appendChild(td);
    tabla.appendChild(tr);

    //poniendo nueva filas
    nuevaFila();
}

function validaAsiento() {
    tabla = document.getElementById("tablaDiario");
    lonFilas = tabla.rows.length;
    var conta = 0;
    while (tabla.rows[(lonFilas - 1)].getElementsByTagName("td")[0].firstElementChild.getAttribute("name") !== "indice") {
        conta++;
        lonFilas--;
    }
    //Si hay mas de 2 filas
    if (conta >= 2) {
        return true;
    } else {
        alert("Por asiento debe existir un debe y un haber");
        return false;
    }
}

function enviaFormulario() {
    if (validaFila()) {
        if (validaAsiento()) {
            if (validaFinal()) {
                return true;
            } else
                return false;
        } else
            return false;
    } else
        return false;
}

function validaFinal() {
    var totalDebe = 0, totalHaber = 0;
    var lonDebe = document.getElementsByName("debe").length;
    for (var i = 0; i < lonDebe; i++) {
        var valor = document.getElementsByName("debe")[i].value;
        if (valor !== "") {
            totalDebe = totalDebe + parseFloat(valor);
        }
    }
    var lonHaber = document.getElementsByName("haber").length;
    for (var i = 0; i < lonHaber; i++) {
        var valor = document.getElementsByName("haber")[i].value;
        if (valor !== "") {
            totalHaber = totalHaber + parseFloat(valor);
        }
    }

    console.log(totalDebe + " = " + totalHaber);

    if (totalDebe === totalHaber) {
        return true;
    } else {
        alert("El debe no es igual al haber");
        return false;
    } 
}



//PARA CEDULAS
var tablaProcesos = document.getElementsByClassName("tablaProcesos")[0];
var nuevaTabla = tablaProcesos.cloneNode("tablaProcesos");
function newProcess() {
    var conteProcesos = document.getElementById("conteProcesos");
    console.log("Aqui");
    nuevaTabla.rows[3].removeAttribute("hidden");
    nuevaTabla.rows[3].children[2].firstElementChild.disabled = true;
    nuevaTabla.rows[0].innerText = "PROCESO " + (document.getElementsByClassName("tablaProcesos").length + 1);
    conteProcesos.insertAdjacentElement("beforeend", nuevaTabla);
}