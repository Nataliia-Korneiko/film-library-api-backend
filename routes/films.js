const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.send('GET /films');
});

module.exports = router;
