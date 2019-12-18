const express = require('express');
const debug = require('debug')('coral-backend:userRouter');
const passport = require('passport');
const authenticate = require('../authenticate');
const Users = require('../models/users');


const router = express.Router();

router.use(express.json());

router.route('/').all((req,res,next) => {
    debug('Routing users /');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    debug('Routing GET users - returns users collection');
    Users.find({})
    .then((users) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
    }, (err) => next(err))
    .catch((err) => next(err));
})
router.post('/signup', (req, res, next) => {
    debug('Routing POST SIGNUP - creates the user');
    Users.register(new People({username: req.body.username}), 
                    req.body.password, (err, user) => {
        if (err) {
            debug('Could not create user');
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');   
            res.json({err: err}) ;
        } else {
            debug('User created successfully');

            passport.authenticate('local')(req, res, () => {
                debug('User authenticated successfully');
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: true, status: 'User registered successfully'});        
            });
        }
    });
});
router.get('/login', passport.authenticate('local'), (req, res) => {
    debug('Routing GET LOGIN - authenticates the user');
    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, token: token, status: 'User successfully logged in'});
});
router.get('/login/facebook', passport.authenticate('facebook-token'), (req, res) => {
    debug('Routing GET LOGIN/FACEBOOK - authenticates the user');
    if (req.user) {
        var token = authenticate.getToken({_id: req.user._id});
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, token: token, status: 'User successfully logged in'});
    }
});

module.exports = router;