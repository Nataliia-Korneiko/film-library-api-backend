const express = require('express');
const router = express.Router();
const guard = require('../helpers/guard');
const { films: ctrl } = require('../controllers');
const { validateAddFilm } = require('../validation/films');

router.post('/', guard, validateAddFilm, ctrl.addFilm);
router.delete('/:filmId', guard, ctrl.deleteFilm);

module.exports = router;
