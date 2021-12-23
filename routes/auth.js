const express = require('express');
const router = express.Router();

router.post('/signup', (req, res, next) => {
  res.send('POST /signup');
});

router.post('/signin', (req, res, next) => {
  res.send('POST /signin');
});

router.post('/logout', (req, res, next) => {
  res.send('PUT /logout');
});

module.exports = router;
