var express = require('express');
var router = express.Router();
var models = require('../models');
var passport = require('passport');
const bcrypt = require('bcrypt');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/register', passport.authenticate('register'));

router.post('/login', passport.authenticate('login'));

module.exports = router;
