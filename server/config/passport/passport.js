'use strict';

var bCrypt = require('bcrypt-nodejs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var models = require('../../models');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    models.User.findById(id).then(function(user) {
        if(user){
            done(null, user.get());
        } else {
            done(user.errors,null);
        }
    });
});

passport.use('register', new LocalStrategy ({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
}, function(req, email, password, done){
    models.User.findOne({
        where: {
            email: email
        }
    }).then(function(user) {
        if(user) {
            return done(null, false, {
                message : 'That email is already taken'
            });
        } else {
            var hash = generateHash(password);
            models.User.create({
                email: email,
                password: hash
            }).then(function(newUser){
                if(!newUser){
                    return done(null,false, { failed: 'Email already exists' });
                }
                if(newUser) {
                    return done(null, newUser, { success: 'Success!' });
                }
            });
        }
    });
}));

passport.use('login', new LocalStrategy ({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
}, function(req, email, password, done) {
    models.User.findOne({
        where: {
            email: email
        }
    }).then(function(user) {
        if(!user) {
            return done(null, false, { failed: 'Email does not exist' });
        } else if(!comparePass(password, user.password)) {
            return done(null, false, { failed: 'Email does not exist' });
        }
        var userinfo = user.get();
        return done(null, userinfo);
    }).catch(function(err){
        console.log("Error:",err);
        return done(null, false, { failed: 'Something went wrong with your Signin' });
    });
}));

// Generate a password hash with a dash of salt
function generateHash(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
};

function comparePass(password, userHash) {
    return bCrypt.compareSync(password, userHash);
}