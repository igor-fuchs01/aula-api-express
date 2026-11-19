var database = require("../database/config");

// SELECT -> GET (listar)
function listar(idUsuario, busca) {
    var instrucaoSql = `
        SELECT a.*,
            (SELECT temperatura FROM medida m WHERE m.fkAmbiente = a.idAmbiente ORDER BY idMedida DESC LIMIT 1) AS ultimaTemperatura,
            (SELECT umidade FROM medida m WHERE m.fkAmbiente = a.idAmbiente ORDER BY idMedida DESC LIMIT 1) AS ultimaUmidade
        FROM ambiente a
        WHERE a.fkUsuario = ?
    `;
    var valores = [idUsuario];

    // Filtro opcional vindo da query string (?busca=...)
    if (busca != undefined && busca != "") {
        instrucaoSql += ` AND a.nome LIKE ?`;
        valores.push(`%${busca}%`);
    }

    instrucaoSql += ` ORDER BY a.nome;`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, valores);
}

// SELECT ... WHERE id -> GET (buscar um)
function buscarPorId(idAmbiente) {
    var instrucaoSql = `SELECT * FROM ambiente WHERE idAmbiente = ?;`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [idAmbiente]);
}

// INSERT -> POST
function cadastrar(nome, descricao, temperaturaMin, temperaturaMax, umidadeMin, umidadeMax, fkUsuario) {
    var instrucaoSql = `
        INSERT INTO ambiente (nome, descricao, temperaturaMin, temperaturaMax, umidadeMin, umidadeMax, fkUsuario)
        VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [nome, descricao, temperaturaMin, temperaturaMax, umidadeMin, umidadeMax, fkUsuario]);
}

// UPDATE -> PUT
function editar(idAmbiente, nome, descricao, temperaturaMin, temperaturaMax, umidadeMin, umidadeMax) {
    var instrucaoSql = `
        UPDATE ambiente
        SET nome = ?, descricao = ?, temperaturaMin = ?, temperaturaMax = ?, umidadeMin = ?, umidadeMax = ?
        WHERE idAmbiente = ?;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [nome, descricao, temperaturaMin, temperaturaMax, umidadeMin, umidadeMax, idAmbiente]);
}

// DELETE -> DELETE (as medidas saem junto por causa do ON DELETE CASCADE)
function deletar(idAmbiente) {
    var instrucaoSql = `DELETE FROM ambiente WHERE idAmbiente = ?;`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [idAmbiente]);
}

module.exports = {
    listar,
    buscarPorId,
    cadastrar,
    editar,
    deletar
};
