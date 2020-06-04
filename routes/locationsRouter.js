const express = require("express");
const authenticate = require("../authenticate");
const logger = require("../config/winston");
const axios = require("axios");
const unidecode = require("unidecode");

const router = express.Router();

router.use(express.json());

router.get("/", (req, res, next) => {
  const url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json"
  const params = `input=${unidecode(req.query.address)}&inputtype=textquery&fields=formatted_address,name,geometry,place_id&key=${process.env.GOOGLE_KEY}`
  axios.get(url + "?" + params)
  .then(response => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(response.data);
  })
  .catch(err => next(err));

})

router.get("/:id", (req, res, next) => {
  const url = "https://maps.googleapis.com/maps/api/place/details/json"
  const params = `place_id=${req.params.id}&key=${process.env.GOOGLE_KEY}`
  logger.debug("get details for place ID " + req.params.id)
  axios.get(url + "?" + params)
  .then(response => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(response.data);
  })
  .catch(err => next(err));

})

module.exports = router;
