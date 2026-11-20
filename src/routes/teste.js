var express = require("express");
var router = express.Router();

var testeController = require("../controllers/testeController");

// GET -> LER (Read)
router.get("/igor", function (req, res) {
    testeController.igor(req, res);
});

module.exports = router;
