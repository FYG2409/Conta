const server = require('./server');

server.listen(server.get('port'), () => {
    console.log("Servidor iniciado en el puerto " + server.get('port'));
});
console.log("Servidor en puesto 3000");
