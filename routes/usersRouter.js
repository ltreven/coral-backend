const express = require('express');
const passport = require('passport');
const authenticate = require('../authenticate');
const Users = require('../models/users');
const logger = require('../config/winston');

const router = express.Router();

router.use(express.json());

router.post('/signup', (req, res, next) => {
    logger.info('Routing POST SIGNUP - creates the user');
    Users.register(new Users(req.body),
        req.body.password, (err, user) => {
            if (err) {
                logger.info('Could not create user');
                console.log(err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({ err: err });
            } else {
                logger.info('User created successfully');

                passport.authenticate('local')(req, res, () => {
                    logger.info('User authenticated successfully');
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ success: true, status: 'User registered successfully' });
                });
            }
        });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    logger.info('Routing POST LOGIN - authenticates the user');
    var token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, token: token, status: 'User successfully logged in' });
});

router.post('/login/facebook', passport.authenticate('facebook-token'), (req, res) => {
    logger.info('Routing GET LOGIN/FACEBOOK - authenticates the user');
    if (req.user) {
        var token = authenticate.getToken({ _id: req.user._id });
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: true, token: token, status: 'User successfully logged in' });
    }
});

router.get("/validateToken", authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, status: 'User is logged in' });
})

router.post('/logout', authenticate.verifyUser, (req, res, next) => {
    console.log("calling logout")
    req.logout();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, status: 'User successfully logged out' });
});

router.put("/:id", (req, res, next) => {
    Users.findByIdAndUpdate(req.params.id, req.body)
    .then(user => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(user);
    })
    .catch(err => next(err));
})
router.get("/:email", (req, res, next) => {
    logger.info("Routing GET User userId", req.params.email);
    Users.find({ username: req.params.email })
        .then(user => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(user);
        })
        .catch(err => next(err));
})

router.get('/', (req, res, next) => {
    logger.info('Routing GET users - returns users collection');
    Users.find({})
        .then(users => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(users);
        })
        .catch((err) => next(err));
})

module.exports = router;