const Datastore = require('nedb');
const path = require('path');

// Configura la base de datos en el archivo `habits.db`
const db = new Datastore({ filename: path.join(__dirname, '../habits.db'), autoload: true });

module.exports = db;
