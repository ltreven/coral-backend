const express = require("express");
const authenticate = require("../authenticate");
const Chat = require("../models/chat");
const Property = require("../models/properties");
const logger = require("../config/winston");

const router = express.Router();

router.use(express.json());

router.post("/:propertyId", authenticate.verifyUser, (req, res, next) => {
  if(!req.body.message) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.json({ status: "nok", message: "Must send a message"});
    return
  }
  // se sou o dono, utilizar parâmetro "to"
  Property.findById(req.params.propertyId)
  .then(property => {
    let msg
    if (req.user._id == property.ownerId.toString()) {
      logger.info("I am the owner sending a message to ", req.query.to)

      msg = new Chat({
        from: req.user._id, 
        property: req.params.propertyId, 
        to: req.query.to, 
        message: req.body.message})

    } else {
      logger.info("I am NOT the owner. So I'm sending a message to the owner. Owner: ", property.ownerId)

      msg = new Chat({
        from: req.user._id, 
        property: req.params.propertyId, 
        to: property.ownerId, 
        message: req.body.message})

    }

    Chat.create(msg).then(newMsg => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(newMsg);
    })
    .catch(err => next(err));
})

  // se não sou o dono, buscar ID do dono e ignorar parâmetro "to"

})

router.get("/:propertyId", authenticate.verifyUser, (req, res, next) => {
  logger.info("Routing GET chat - returns conversation from logged user");
  let from = req.user._id

  Property.findById(req.params.propertyId)
  .then(property => {
    let filter
    if (req.user._id == property.ownerId.toString()) {
      logger.info("I am the owner looking from messages to/from ", req.query.with)

      filter = {
        $or: [{ from: req.query.with }, { to: req.query.with }],
        property: req.params.propertyId
      }

    } else {
      logger.info("I am NOT the owner. So I'm looking from messages to/from the owner to/from me. Owner: ", property.ownerId)

      filter = {
        $or: [
          { $and: [{ from: property.ownerId }, { to: req.user._id}] }, 
          { $and: [{ from: req.user._id }, { to: property.ownerId}] }, 
        ],
        property: req.params.propertyId, 
      }
    }

    Chat.find(filter).sort({createdAt: 1})
    .then(messages => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(messages);
    })
    .catch(err => next(err));
  })

})

router.get("/:propertyId/chatlist", authenticate.verifyUser, (req, res, next) => {
  logger.info("Routing GET chatlist for a specific property");
  let from = req.user._id

  Property.findById(req.params.propertyId)
  .then(property => {
    if (req.user._id == property.ownerId.toString()) {
      logger.info("I am the owner looking from messages ")

      const filter = {
        property: req.params.propertyId
      }
      Chat.find(filter).sort({createdAt: -1}).populate('from', ['_id', 'fullName', 'picture'])
      .then(messages => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        const contacts = []
        const newMsgs = messages.filter(msg => {
          if (contacts.indexOf(msg.from.toString()) < 0 
            && msg.from._id.toString() != req.user._id) {
            contacts.push(msg.from.toString())
            console.log("added")
            return true
          }
          console.log("not added")
          return false
        })

        res.json(newMsgs.map(msg => (
          {
            from: msg.from,
            message: msg.message,
            createdAt: msg.createdAt
          }
        )));

      })
      .catch(err => next(err));
  
    } else {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.json({ status: "forbidden"});
      return;
    }

  })

})

module.exports = router;
