const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');
const { reviewSchema } = require('../schemas/validation');
const catchAsync = require('../utility/catchAsync');
// const { reviewSchema } = require('../schemas/validation');

const users = require('../controllers/users');

router.get('/register', users.registerPage);
router.post('/register', users.register);

router.get('/login', users.loginPage);
router.post('/login', passport.authenticate('local', {failureFlash:true, failureRedirect: '/login'}), users.login)

router.get('/logout', users.logout)

module.exports = router;