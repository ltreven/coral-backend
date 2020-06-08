const express = require("express");
const authenticate = require("../authenticate");
const Chat = require("../models/chat");
const logger = require("../config/winston");

const router = express.Router();

router.use(express.json());

router.get("/:to", (req, res, next) => {
  logger.info("Routing GET chat - returns conversation from logged user with specific person");
  const me = "5edcaea0d4daa082a491d9a9"
  Chat.find({from: me, to: req.params.to})
  .then(messages => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(messages);
  })
  .catch(err => next(err));
})

module.exports = router;
