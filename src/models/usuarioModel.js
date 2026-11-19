var database = require("../database/config");

// O MODEL é a única camada que conversa com o banco.
// Cada "?" na instrução é trocado, em ordem, pelos valores do array.

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL -> function autenticar():", email);
    var instrucaoSql = `
        SELECT idUsuario, nome, email
        FROM usuario
        WHERE email = ? AND senha = ?;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [email, senha]);
}

function cadastrar(nome, email, senha) {
    console.log("ACESSEI O USUARIO MODEL -> function cadastrar():", nome, email);
    var instrucaoSql = `
        INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?);
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [nome, email, senha]);
}

module.exports = {
    autenticar,
    cadastrar
};
