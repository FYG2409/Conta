const { Router } = require('express');
const router = Router();
const cuenta = require('../modelo/cuenta');
const db = require('../database').database();


router.get('/', (req, res) => {
    res.render('index.html');
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

    var cortoAP = arrs2[0];
    var largoAP = arrs2[1];
    var capitalC = arrs2[2];

    res.render('resultados.html', { arreglo, totalesEResu, cortoAP, largoAP, capitalC });
});

router.post('/cedulas', (req, res) => {
    var datos = req.body;
    var numProcesos = datos.pTerminada.length;
    for (var i = 0; i < numProcesos; i++) {
        for (const prop in datos) {
            if (datos[prop][i] !== "") {
                datos[prop][i] = parseFloat(datos[prop][i]);
            } else
                datos[prop][i] = 0;
        }
    }
    console.log(datos);
    res.send("Hello");
    //res.render('cedulas.html', {datos, numProcesos});
});

module.exports = router;