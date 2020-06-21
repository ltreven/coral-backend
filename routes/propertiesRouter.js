const express = require("express");
const authenticate = require("../authenticate");
const Properties = require("../models/properties");
const logger = require("../config/winston");

const router = express.Router();

router.use(express.json());

router.get("/", (req, res, next) => {
  let filter = {}
  if (req.query.status) {
    filter = { status: req.query.status }
  }
  Properties.find(filter)
    .then(properties => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(properties);
    })
    .catch(err => next(err));
})

router.post("/", authenticate.verifyUser, (req, res, next) => {
  Properties.create(req.body)
    .then(property => {
      logger.info("Property created successfully");
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(property);
    })
    .catch(err => next(err));
})

router.put("/", authenticate.verifyUser, (req, res, next) => {
  res.statusCode = 403;
  res.end("PUT operation not supported");
})

router.delete("/", authenticate.verifyUser, (req, res, next) => {
  res.statusCode = 403;
  res.end("DELETE operation not supported");
});

router.get("/myproperties", authenticate.verifyUser, (req, res, next) => {
  Properties.find({ ownerId: req.user._id })
    .then(properties => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(properties);
    })
    .catch(err => next(err));
})

router.get("/:propertyId", (req, res, next) => {
  Properties.findById(req.params.propertyId)
    .then(property => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(property);
    })
    .catch(err => next(err));
})

router.post("/:propertyId", (req, res, next) => {
  res.statusCode = 403;
  res.end("POST operation not supported on /properties/:id");
})

router.put("/:propertyId", authenticate.verifyUser, (req, res, next) => {
  Properties.findByIdAndUpdate(
    req.params.propertyId,
    {
      $set: req.body
    },
    { new: true }
  )
    .then(property => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(property);
    })
    .catch(err => next(err));
})
router.delete("/:propertyId", authenticate.verifyUser, (req, res, next) => {
  // enhancement needed: do not DELETE physically. Create logical deletion
  Properties.findByIdAndRemove(req.params.propertyId)
    .then(resp => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(resp);
    })
    .catch(err => next(err));
});

module.exports = router;
