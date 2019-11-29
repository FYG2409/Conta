const db = require('../database').database();

const nodo_Cuentas = 'Cuentas';
const nodo_eResultados = 'eResultados';

function registraCuenta(cuentaTxt, cuentaObj) {
    db.ref(nodo_Cuentas + '/' + cuentaTxt).set(cuentaObj).then(() => {
        //Si todo fue bien
        console.log("Cuenta registrada exitosamente");
    }).catch((error) => {
        //Si todo fue mal
        console.log(error.code);
    });
}

function separaPlazo(arreglo) {
    var cortoA = [];
    var largoA = [];
    var largoP = [];
    var cortoP = [];
    var capitalC = [];
    for (var i = 0; i < arreglo.length; i++) {
        var salCon = {
            concepto: arreglo[i].concepto,
            saldo: arreglo[i].saldo
        };
        if (arreglo[i].plazo === 'corto' && arreglo[i].tipo === 'activo') {
            cortoA.push(salCon);
        } else
            if (arreglo[i].plazo === 'largo' && arreglo[i].tipo === 'activo') {
                largoA.push(salCon);
            } else
                if (arreglo[i].plazo === 'corto' && arreglo[i].tipo === 'pasivo') {
                    cortoP.push(salCon);
                } else
                    if (arreglo[i].plazo === 'largo' && arreglo[i].tipo === 'pasivo') {
                        largoP.push(salCon);
                    } else
                        if (arreglo[i].tipo === 'capital') {
                            capitalC.push(salCon);
                        }
    }
    var cortoAP = [cortoA, cortoP];
    var largoAP = [largoA, largoP];
    return [cortoAP, largoAP, capitalC];
}

function obtenSaldos(arreglo) {
    for (var i = 0; i < arreglo.length; i++) {
        var saldo;
        if (arreglo[i].totalHaber > arreglo[i].totalDebe) {
            saldo = arreglo[i].totalHaber - arreglo[i].totalDebe;
        } else {
            saldo = arreglo[i].totalDebe - arreglo[i].totalHaber;
        }
        arreglo[i].saldo = saldo;
    }
    return arreglo;
}

async function llenaArregloConceptos(body) {
    var lonCon = body.concepto.length;

    var conceptosObj = [];

    var arreglo = [];

    for (var i = 0; i < lonCon; i++) {
        var existe = false;
        var debeTxt = body.debe[i];
        var haberTxt = body.haber[i];
        var conceptoTxt = body.concepto[i]
        var j;
        for (j = 0; j < conceptosObj.length; j++) {
            if (conceptosObj[j] === conceptoTxt) {
                existe = true;
                break;
            }
        }
        if (!existe) {
            conceptosObj.push(conceptoTxt);
            var tHaber, tDebe;
            if (haberTxt === "") {
                tHaber = 0;
            } else {
                tHaber = parseFloat(haberTxt);
            }
            if (debeTxt === "") {
                tDebe = 0;
            } else {
                tDebe = parseFloat(debeTxt);
            }

            var cue = await traeConcepto(conceptoTxt);
            var tipo = cue.tipo;
            var plazo = cue.plazo;

            var cuenta = {
                concepto: conceptoTxt,
                debe: [debeTxt],
                haber: [haberTxt],
                totalDebe: tDebe,
                totalHaber: tHaber,
                tipo: tipo,
                plazo: plazo,
                saldo: 0
            };
            arreglo.push(cuenta);
        } else {
            if (debeTxt !== "") {
                arreglo[j].debe.push(debeTxt);
                arreglo[j].totalDebe = arreglo[j].totalDebe + parseFloat(debeTxt);
            }
            if (haberTxt !== "") {
                arreglo[j].haber.push(haberTxt);
                arreglo[j].totalHaber = arreglo[j].totalHaber + parseFloat(haberTxt);
            }
        }
    }
    arreglos = await obtenSaldos(arreglo);

    var totalesTit = await llenaTotalesEResultados(body.ptu, body.isr, arreglo, conceptosObj);

    return [arreglos, totalesTit];
}

async function traeConcepto(concepto) {
    var valor;
    await db.ref(nodo_Cuentas + '/' + concepto).once("value").then(function (snapshot) {
        valor = snapshot.val();
    }, function (errorObject) {
        console.error(errorObject.code);
        });

    return valor;
}

function llenaTotalesEResultados(ptu, isr, arreglo, conceptosObj) {
    var tit = ['Ventas', 'Costo de Ventas', 'Gastos de Venta', 'Gastos de Administracion', 'Productos Financieros', 'Gastos Financieros', 'Otros Ingresos o Productos', 'Otros Gastos o Perdidas'];
    var totalesTit = [];
    for (var k = 0; k < tit.length; k++) {
        var indice = conceptosObj.indexOf(tit[k]);
        if (indice !== -1) {
            var indeT = arreglo[indice].totalHaber;
            if (indeT < arreglo[indice].totalDebe) {
                indeT = arreglo[indice].totalDebe;
            }
            totalesTit.push(indeT);
        } else {
            totalesTit.push(0);
        }
    }

    if (ptu !== "") {
        totalesTit.push(parseFloat(ptu));
    } else {
        totalesTit.push(0);
    }

    if (isr !== "") {
        totalesTit.push(parseFloat(isr));
    } else {
        totalesTit.push(0);
    }

    return totalesTit;
}


//PARA SUBCUENTAS
async function llenaSubCuentas(body) {
    var subConceptosObj = [];

    var arreglo = [];

    for (var i = 0; i < body.subConcepto.length; i++) {
        var existe = false;
        var debeTxt = body.subDebe[i];
        var haberTxt = body.subHaber[i];
        var conceptoTxt = body.subConcepto[i]
        var j;
        for (j = 0; j < subConceptosObj.length; j++) {
            if (subConceptosObj[j] === conceptoTxt) {
                existe = true;
                break;
            }
        }
        if (!existe) {
            subConceptosObj.push(conceptoTxt);
            var tHaber, tDebe;
            if (haberTxt === "") {
                tHaber = 0;
            } else {
                tHaber = parseFloat(haberTxt);
            }
            if (debeTxt === "") {
                tDebe = 0;
            } else {
                tDebe = parseFloat(debeTxt);
            }

            var subCuenta = {
                subCuenta: conceptoTxt,
                debe: [debeTxt],
                haber: [haberTxt],
                totalDebe: tDebe,
                totalHaber: tHaber,
                saldo: 0
            }
            arreglo.push(subCuenta);
        } else {
            if (debeTxt !== "") {
                arreglo[j].debe.push(debeTxt);
                arreglo[j].totalDebe = arreglo[j].totalDebe + parseFloat(debeTxt);
            }
            if (haberTxt !== "") {
                arreglo[j].haber.push(haberTxt);
                arreglo[j].totalHaber = arreglo[j].totalHaber + parseFloat(haberTxt);
            }
        }
    }
    
    arreglo = await obtenSaldos(arreglo);

    return arreglo;
}


const cuenta = {};
cuenta.registraCuenta = registraCuenta;
cuenta.llenaArregloConceptos = llenaArregloConceptos;
cuenta.separaPlazo = separaPlazo;
cuenta.llenaSubCuentas = llenaSubCuentas;

module.exports = cuenta;
