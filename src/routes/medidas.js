var express = require("express");
var router = express.Router();

var medidaController = require("../controllers/medidaController");

// params + query opcional: GET /medidas/ultimas/1?limite=10
router.get("/ultimas/:idAmbiente", function (req, res) {
    medidaController.buscarUltimasMedidas(req, res);
});

// params: GET /medidas/tempo-real/1  (última leitura, chamada a cada 2s pelo dashboard)
router.get("/tempo-real/:idAmbiente", function (req, res) {
    medidaController.buscarMedidaEmTempoReal(req, res);
});

// params: GET /medidas/kpi/1  (mínimo, máximo e média de hoje)
router.get("/kpi/:idAmbiente", function (req, res) {
    medidaController.buscarKpis(req, res);
});

// params + body: POST /medidas/inserir/1  { temperatura, umidade }
router.post("/inserir/:idAmbiente", function (req, res) {
    medidaController.inserir(req, res);
});

module.exports = router;
