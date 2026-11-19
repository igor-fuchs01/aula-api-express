var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

// POST /usuarios/cadastrar   body: { nomeServer, emailServer, senhaServer }
router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
});

// POST /usuarios/autenticar  body: { emailServer, senhaServer }
router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

module.exports = router;
