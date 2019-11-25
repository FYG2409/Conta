const express = require('express');
const morgan = require('morgan'); //midleware, siempre esta en medio de las peticiones al servidor
const path = require('path');
const ejs = require('ejs');

//Inicializaciones
const server = express();

//Setting
server.set('port', process.env.PORT || 3000);
server.set('views', path.join(__dirname, 'views'));

server.set('view engine', 'ejs');
server.engine('html', ejs.renderFile);


/*
server.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(server.get('views'), 'layouts'),
    partialsDir: path.join(server.get('views'), 'partials'),
    extname: '.hbs'
}))
server.set('view engine', '.hbs');
*/
//Middlewares
server.use(morgan('Dev'));
server.use(express.urlencoded({ extended: false }));

//Routes
server.use(require('./routes/index.js'));

//variables globales


//Static Files--Publics
server.use(express.static(path.join(__dirname, 'public')));


module.exports = server;