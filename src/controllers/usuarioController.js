var usuarioModel = require("../models/usuarioModel");

// O CONTROLLER recebe a requisição (req), valida os dados,
// chama o MODEL e devolve a resposta (res) com o status HTTP certo.

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");   // 400 = requisição inválida
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else {
        usuarioModel.autenticar(email, senha)
            .then(function (resultadoAutenticar) {
                console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);

                if (resultadoAutenticar.length == 1) {
                    // 200 = OK. Nunca devolvemos a senha!
                    res.status(200).json({
                        id: resultadoAutenticar[0].idUsuario,
                        nome: resultadoAutenticar[0].nome,
                        email: resultadoAutenticar[0].email
                    });
                } else {
                    res.status(403).send("E-mail e/ou senha inválido(s)"); // 403 = acesso negado
                }
            })
            .catch(function (erro) {
                console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);                // 500 = erro no servidor
            });
    }
}

function cadastrar(req, res) {
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else {
        usuarioModel.cadastrar(nome, email, senha)
            .then(function (resultado) {
                // 201 = criado com sucesso. insertId é o id gerado pelo AUTO_INCREMENT
                res.status(201).json({ idUsuario: resultado.insertId });
            })
            .catch(function (erro) {
                console.log("\nHouve um erro ao realizar o cadastro! Erro: ", erro.sqlMessage);
                if (erro.code == "ER_DUP_ENTRY") {
                    res.status(409).send("Este e-mail já está cadastrado!"); // 409 = conflito
                } else {
                    res.status(500).json(erro.sqlMessage);
                }
            });
    }
}

module.exports = {
    autenticar,
    cadastrar
};
