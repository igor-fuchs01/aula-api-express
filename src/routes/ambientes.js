var express = require("express");
var router = express.Router();

var ambienteController = require("../controllers/ambienteController");

// GET -> LER (Read)
router.get("/listar/:idUsuario", function (req, res) {
    ambienteController.listar(req, res);
});

// params: GET /ambientes/buscar/2
router.get("/buscar/:idAmbiente", function (req, res) {
    ambienteController.buscarPorId(req, res);
});

// POST -> CRIAR (Create)
router.post("/cadastrar", function (req, res) {
    ambienteController.cadastrar(req, res);
});

// PUT -> ATUALIZAR (Update)
router.put("/editar/:idAmbiente", function (req, res) {
    ambienteController.editar(req, res);
});

// params: DELETE /ambientes/deletar/2
router.delete("/deletar/:idAmbiente", function (req, res) {
    ambienteController.deletar(req, res);
});

module.exports = router;
