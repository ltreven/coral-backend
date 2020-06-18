const express = require("express");
const authenticate = require("../authenticate");
const Properties = require("../models/properties");
const logger = require("../config/winston");

const router = express.Router();

router.use(express.json());

router
  .route("/")
  .all((req, res, next) => {
    logger.info("Routing properties/");
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res, next) => {
    logger.info("Routing GET properties - returns properties collection");
    Properties.find({status: 'published'})
      .then(
        properties => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(properties);
        },
        err => next(err)
      )
      .catch(err => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    logger.info("Routing POST properties - creates a property");
    Properties.create(req.body)
      .then(
        property => {
          logger.info("Property created successfully");
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(property);
        },
        err => next(err)
      )
      .catch(err => next(err));

    // after creating a prop, put logic here
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    logger.info(
      "Routing PUT property - does nothing - need to specify the property id"
    );
    res.statusCode = 403;
    res.end("PUT operation not supported");
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    logger.info(
      "Routing DELETE property - does nothing - need to specify the property id"
    );
    res.statusCode = 403;
    res.end("DELETE operation not supported");
  });

router.get("/myproperties", authenticate.verifyUser, (req, res, next) => {
  logger.info("Routing GET my properties - returns properties collection of a specific owner");
  console.log("user: ", req.user)
  Properties.find({ownerId: req.user._id})
    .then(
      properties => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(properties);
      },
      err => next(err)
    )
    .catch(err => next(err));
})

router
  .route("/:propertyId")
  .all((req, res, next) => {
    logger.info("Routing properties/:propertyId");
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res, next) => {
    logger.info("Routing GET properties/:propertyId", req.params.propertyId);
    Properties.findById(req.params.propertyId)
      .then(
        property => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(property);
        },
        err => next(err)
      )
      .catch(err => next(err));
  })
  .post((req, res, next) => {
    logger.info("Routing POST properties/:propertyId");
    res.statusCode = 403;
    res.end(
      "POST operation not supported on /properties/" + req.params.propertyId
    );
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    logger.info("Routing PUT properties/:propertyId", req.params.propertyId);
    Properties.findByIdAndUpdate(
      req.params.propertyId,
      {
        $set: req.body
      },
      { new: true }
    )
      .then(
        property => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(property);
        },
        err => next(err)
      )
      .catch(err => next(err));
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    logger.info("Routing DELETE properties/:propertyId", req.params.propertyId);
    // enhancement needed: do not DELETE physically. Create logical deletion
    Properties.findByIdAndRemove(req.params.propertyId)
      .then(
        resp => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        err => next(err)
      )
      .catch(err => next(err));
  });

module.exports = router;
