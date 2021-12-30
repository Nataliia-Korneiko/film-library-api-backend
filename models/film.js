const { model } = require('mongoose');
const { filmSchema } = require('./schemas');

const Film = model('film', filmSchema);

module.exports = Film;
