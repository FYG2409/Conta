const { Router } = require('express');
const router = Router();
const cuenta = require('../modelo/cuenta');
const db = require('../database').database();
var datos, numProcesos;
var bSubCuentas;

router.get('/', (req, res) => {
    res.render('index.html');
});

router.post('/soloDiario', (req, res) => {
    bSubCuentas = false;
    console.log(datos);
    res.render('diario.html', {bSubCuentas});
});

router.post('/diario', (req, res) => {
    bSubCuentas = true;
    var nomProcesos = req.body.nomProceso;
    console.log(nomProcesos);

    //GUARDANDO DATOS DE PROCESOS
    datos = req.body;
    numProcesos = datos.pTerminada.length;
    for (var i = 0; i < numProcesos; i++) {
        for (const prop in datos) {
            if (prop !== 'nomProceso') {
                if (datos[prop][i] !== "") {
                    datos[prop][i] = parseFloat(datos[prop][i]);
                } else
                    datos[prop][i] = 0;
            }
        }
    }

    res.render('diario.html', { bSubCuentas, nomProcesos });
});

router.post('/regEstado', (req, res) => {
    cuenta.registraEstrado(req.body.cuenta);
    res.render('index.html');
});

router.post('/regCuenta', (req, res) => {
    const objCuenta = {
        tipo: req.body.tipoR,
        plazo: req.body.plazoR  
    }
    cuenta.registraCuenta(req.body.cuentaR, objCuenta);
    res.render('index.html');
});

router.post('/resultados', async (req, res) => {
    var arrs = await cuenta.llenaArregloConceptos(req.body);
    var arreglo = arrs[0]
    var totalesEResu = arrs[1];
    var arrs2 = await cuenta.separaPlazo(arreglo);
    var totalesEProduccion = await cuenta.llenaTotalesECProduccion(arreglo);

    var cortoAP = arrs2[0];
    var largoAP = arrs2[1];
    var capitalC = arrs2[2];

    //PARA SUB CUENTAS
    var subArreglo;
    var totalesEProduccion;
    bSubCuentas = true;
    if (bSubCuentas) {
        subArreglo = await cuenta.llenaSubCuentas(req.body);
        totalesEProduccion = await cuenta.llenaTotalesECProduccion(arreglo);
        console.log("totalesEProduccion");
        console.log(totalesEProduccion);
        console.log("SubArreglo");
        console.log(subArreglo);
    }
    console.log("Arreglo");
    console.log(arreglo);

    console.log(bSubCuentas);

    console.log("------------------------------------------");



    res.render('resultados.html', { arreglo, totalesEResu, cortoAP, largoAP, capitalC, subArreglo, datos, numProcesos, bSubCuentas, totalesEProduccion });
});
/*
router.post('/cedulas', (req, res) => {
    datos = req.body;
    numProcesos = datos.pTerminada.length;
    for (var i = 0; i < numProcesos; i++) {
        for (const prop in datos) {
            if (prop !== 'nomProceso') {
                if (datos[prop][i] !== "") {
                    datos[prop][i] = parseFloat(datos[prop][i]);
                } else
                    datos[prop][i] = 0;
            }
        }
    }
    console.log(datos);
    res.render('cedulas.html', {datos, numProcesos});
});*/

module.exports = router;