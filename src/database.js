const firebase = require('firebase');
const firebaseConfig = require('./keys')

const firebaseInit = firebase.initializeApp(firebaseConfig);

module.exports = firebaseInit;