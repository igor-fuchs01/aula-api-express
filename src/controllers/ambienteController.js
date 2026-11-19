var ambienteModel = require("../models/ambienteModel");

// GET /ambientes/listar/:idUsuario?busca=texto
function listar(req, res) {
    var idUsuario = req.params.idUsuario;
    var busca = req.query.busca; // pode vir undefined, e tudo bem

    ambienteModel.listar(idUsuario, busca)
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send(); // 204 = deu certo, mas não há conteúdo
            }
        })
        .catch(function (erro) {
            console.log("Houve um erro ao listar os ambientes: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

// GET /ambientes/buscar/:idAmbiente
function buscarPorId(req, res) {
    var idAmbiente = req.params.idAmbiente;

    ambienteModel.buscarPorId(idAmbiente)
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado[0]);
            } else {
                res.status(404).send("Ambiente não encontrado!"); // 404 = não encontrado
            }
        })
        .catch(function (erro) {
            console.log("Houve um erro ao buscar o ambiente: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

// POST /ambientes/cadastrar
function cadastrar(req, res) {
    var nome = req.body.nome;
    var descricao = req.body.descricao || null; // campo opcional
    var temperaturaMin = req.body.temperaturaMin;
    var temperaturaMax = req.body.temperaturaMax;
    var umidadeMin = req.body.umidadeMin;
    var umidadeMax = req.body.umidadeMax;
    var fkUsuario = req.body.fkUsuario;

    if (nome == undefined || nome == "") {
        res.status(400).send("O nome do ambiente está vazio!");
    } else if (fkUsuario == undefined) {
        res.status(400).send("fkUsuario está undefined!");
    } else if (Number(temperaturaMin) >= Number(temperaturaMax)) {
        res.status(400).send("A temperatura mínima deve ser menor que a máxima!");
    } else if (Number(umidadeMin) >= Number(umidadeMax)) {
        res.status(400).send("A umidade mínima deve ser menor que a máxima!");
    } else {
        ambienteModel.cadastrar(nome, descricao, temperaturaMin, temperaturaMax, umidadeMin, umidadeMax, fkUsuario)
            .then(function (resultado) {
                res.status(201).json({ idAmbiente: resultado.insertId }); // 201 = criado
            })
            .catch(function (erro) {
                console.log("Houve um erro ao cadastrar o ambiente: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

// PUT /ambientes/editar/:idAmbiente
function editar(req, res) {
    var idAmbiente = req.params.idAmbiente;
    var nome = req.body.nome;
    var descricao = req.body.descricao || null; // campo opcional
    var temperaturaMin = req.body.temperaturaMin;
    var temperaturaMax = req.body.temperaturaMax;
    var umidadeMin = req.body.umidadeMin;
    var umidadeMax = req.body.umidadeMax;

    if (nome == undefined || nome == "") {
        res.status(400).send("O nome do ambiente está vazio!");
    } else if (Number(temperaturaMin) >= Number(temperaturaMax)) {
        res.status(400).send("A temperatura mínima deve ser menor que a máxima!");
    } else if (Number(umidadeMin) >= Number(umidadeMax)) {
        res.status(400).send("A umidade mínima deve ser menor que a máxima!");
    } else {
        ambienteModel.editar(idAmbiente, nome, descricao, temperaturaMin, temperaturaMax, umidadeMin, umidadeMax)
            .then(function (resultado) {
                // affectedRows = quantas linhas o UPDATE alterou
                if (resultado.affectedRows == 0) {
                    res.status(404).send("Ambiente não encontrado!");
                } else {
                    res.status(200).json({ mensagem: "Ambiente atualizado!" });
                }
            })
            .catch(function (erro) {
                console.log("Houve um erro ao editar o ambiente: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

// DELETE /ambientes/deletar/:idAmbiente
function deletar(req, res) {
    var idAmbiente = req.params.idAmbiente;

    ambienteModel.deletar(idAmbiente)
        .then(function (resultado) {
            if (resultado.affectedRows == 0) {
                res.status(404).send("Ambiente não encontrado!");
            } else {
                res.status(200).json({ mensagem: "Ambiente removido!" });
            }
        })
        .catch(function (erro) {
            console.log("Houve um erro ao deletar o ambiente: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    listar,
    buscarPorId,
    cadastrar,
    editar,
    deletar
};
