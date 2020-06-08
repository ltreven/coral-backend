const express = require('express');
const passport = require('passport');
const authenticate = require('../authenticate');
const Users = require('../models/users');
const logger = require('../config/winston');

const router = express.Router();

router.use(express.json());


router.post('/signup', (req, res, next) => {
    logger.info('Routing POST SIGNUP - creates the user');
    Users.register(new Users({ username: req.body.username }),
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


//   .post((req, res, next) => {
//     logger.info("Routing POST people/:personId");
//     res.statusCode = 403;
//     res.end("POST operation not supported on /people/" + req.params.personId);
//   })
//   .put(authenticate.verifyUser, (req, res, next) => {
//     logger.info("Routing PUT people/:personId", req.params.personId);
//     People.findByIdAndUpdate(
//       req.params.personId,
//       {
//         $set: req.body
//       },
//       { new: true }
//     )
//       .then(
//         person => {
//           res.statusCode = 200;
//           res.setHeader("Content-Type", "application/json");
//           res.json(person);
//         },
//         err => next(err)
//       )
//       .catch(err => next(err));
//   })
//   .delete(authenticate.verifyUser, (req, res, next) => {
//     logger.info("Routing DELETE people/:personId", req.params.personId);
//     // enhancement needed: do not DELETE physically. Create logical deletion
//     People.findByIdAndRemove(req.params.personId)
//       .then(
//         resp => {
//           res.statusCode = 200;
//           res.setHeader("Content-Type", "application/json");
//           res.json(resp);
//         },
//         err => next(err)
//       )
//       .catch(err => next(err));
//   });

module.exports = router;