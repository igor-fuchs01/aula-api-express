var medidaModel = require("../models/medidaModel");

// GET /medidas/ultimas/:idAmbiente?limite=10
function buscarUltimasMedidas(req, res) {
    var idAmbiente = req.params.idAmbiente;
    // query opcional: se não vier, usamos 7 (valor padrão)
    var limite_linhas = Number(req.query.limite) || 7;

    console.log(`Recuperando as últimas ${limite_linhas} medidas`);

    medidaModel.buscarUltimasMedidas(idAmbiente, limite_linhas)
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send();
            }
        })
        .catch(function (erro) {
            console.log("Houve um erro ao buscar as últimas medidas.", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

// GET /medidas/tempo-real/:idAmbiente
function buscarMedidaEmTempoReal(req, res) {
    var idAmbiente = req.params.idAmbiente;

    medidaModel.buscarMedidaEmTempoReal(idAmbiente)
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado[0]);
            } else {
                res.status(204).send();
            }
        })
        .catch(function (erro) {
            console.log("Houve um erro ao buscar a medida em tempo real.", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

// GET /medidas/kpi/:idAmbiente
function buscarKpis(req, res) {
    var idAmbiente = req.params.idAmbiente;

    medidaModel.buscarKpis(idAmbiente)
        .then(function (resultado) {
            res.status(200).json(resultado[0]);
        })
        .catch(function (erro) {
            console.log("Houve um erro ao buscar os KPIs.", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

// POST /medidas/inserir/:idAmbiente   body: { temperatura, umidade }
function inserir(req, res) {
    var idAmbiente = req.params.idAmbiente;
    var temperatura = req.body.temperatura;
    var umidade = req.body.umidade;

    if (temperatura == undefined || isNaN(temperatura)) {
        res.status(400).send("Temperatura inválida!");
    } else if (umidade == undefined || isNaN(umidade)) {
        res.status(400).send("Umidade inválida!");
    } else {
        medidaModel.inserir(idAmbiente, temperatura, umidade)
            .then(function (resultado) {
                res.status(201).json({ idMedida: resultado.insertId });
            })
            .catch(function (erro) {
                console.log("Houve um erro ao inserir a medida.", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

module.exports = {
    buscarUltimasMedidas,
    buscarMedidaEmTempoReal,
    buscarKpis,
    inserir
};
