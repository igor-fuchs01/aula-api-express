var database = require("../database/config");

function buscarUltimasMedidas(idAmbiente, limite_linhas) {
    // Subquery: pega as N mais recentes e depois ordena da mais antiga para a mais nova (para o gráfico)
    var instrucaoSql = `
        SELECT * FROM (
            SELECT idMedida, temperatura, umidade, momento,
                DATE_FORMAT(momento, '%H:%i:%s') AS momento_grafico
            FROM medida
            WHERE fkAmbiente = ?
            ORDER BY idMedida DESC
            LIMIT ?
        ) AS ultimas
        ORDER BY idMedida ASC;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [idAmbiente, limite_linhas]);
}

function buscarMedidaEmTempoReal(idAmbiente) {
    var instrucaoSql = `
        SELECT temperatura, umidade,
            DATE_FORMAT(momento, '%H:%i:%s') AS momento_grafico,
            fkAmbiente
        FROM medida
        WHERE fkAmbiente = ?
        ORDER BY idMedida DESC LIMIT 1;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [idAmbiente]);
}

function buscarKpis(idAmbiente) {
    var instrucaoSql = `
        SELECT
            COUNT(*) AS totalLeituras,
            MIN(temperatura) AS temperaturaMin,
            MAX(temperatura) AS temperaturaMax,
            ROUND(AVG(temperatura), 1) AS temperaturaMedia,
            ROUND(AVG(umidade), 1) AS umidadeMedia
        FROM medida
        WHERE fkAmbiente = ? AND DATE(momento) = CURDATE();
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [idAmbiente]);
}

function inserir(idAmbiente, temperatura, umidade) {
    var instrucaoSql = `
        INSERT INTO medida (temperatura, umidade, fkAmbiente) VALUES (?, ?, ?);
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [temperatura, umidade, idAmbiente]);
}

module.exports = {
    buscarUltimasMedidas,
    buscarMedidaEmTempoReal,
    buscarKpis,
    inserir
};
