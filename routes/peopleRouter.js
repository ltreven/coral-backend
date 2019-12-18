const express = require('express');
const authenticate = require('../authenticate');
const People = require('../models/people');
const logger = require('../config/winston');

const router = express.Router();

router.use(express.json());

router.route('/')
.all((req,res,next) => {
    logger.info('Routing people/');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    logger.info('Routing GET people - returns people collection');
    People.find({})
    .then((people) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(people);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    logger.info('Routing POST people - creates a person');
    People.create(req.body)
    .then((person) => {
        logger.info('Person created successfully');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(person);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req, res, next) => {
    logger.info('Routing PUT people - does nothing - need to specify the person id');
    res.statusCode = 403;
    res.end('PUT operation not supported');
})
.delete(authenticate.verifyUser, (req, res, next) => {
    logger.info('Routing DELETE people - does nothing - need to specify the person id');
    res.statusCode = 403;
    res.end('DELETE operation not supported');
});

router.route('/:personId')
.all((req,res,next) => {
    logger.info('Routing people/:personId');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    logger.info('Routing GET people/:personId', req.params.personId);
    People.findById(req.params.personId)
    .then((person) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(person);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    logger.info('Routing POST people/:personId');
    res.statusCode = 403;
    res.end('POST operation not supported on /people/'+ req.params.personId);
})
.put(authenticate.verifyUser, (req, res, next) => {
    logger.info('Routing PUT people/:personId', req.params.personId);
    People.findByIdAndUpdate(req.params.personId, {
        $set: req.body
    }, { new: true })
    .then((person) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(person);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    logger.info('Routing DELETE people/:personId', req.params.personId);
    // enhancement needed: do not DELETE physically. Create logical deletion
    People.findByIdAndRemove(req.params.personId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = router;