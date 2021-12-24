const express = require('express');
const router = express.Router();
const { auth: ctrl } = require('../controllers/index');
const { createAccountLimiter } = require('../helpers/rate-limit');
const guard = require('../helpers/guard');
const { validateSignup, validateSignin } = require('../validation/auth');

router.post('/signup', createAccountLimiter, validateSignup, ctrl.signup);
router.post('/signin', validateSignin, ctrl.signin);
router.post('/logout', guard, ctrl.logout);

module.exports = router;
