var express = require('express');
var router = express.Router();
var models = require('../models');
var fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

var cert = fs.readFileSync('./jwtRS256.key');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/register', function(req, res, next) {
    const body = req.body;
    models.User.findOne({
        where: {
            email: body.email
        }
    }).then(function(user) {
        if(user) {
            return res.status(409).send("User Already Exists");
        } else {
            bcrypt.hash(body.password, 10, function(err, hash) {
                if(err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    models.User.create({
                        email: body.email,
                        password: hash
                    }).then(function() {
                        res.status(200).send("User Created");
                    });
                }
            });
        }
    });

});

router.post('/login', function(req, res, next) {
    const body = req.body;
    models.User.findOne({
        where: {
            email: body.email
        }
    }).then(function(user) {
        bcrypt.compare(body.password, user.password, function(err, result) {
            if(err) {
                res.status(401).json({
                    failed: 'Incorrect Login'
                });
            } else if(result) {
                // Response code goes here

            } else {
                res.status(401).json({
                    failed: 'Incorrect Login'
                });
            }
        });
    });
});

module.exports = router;
