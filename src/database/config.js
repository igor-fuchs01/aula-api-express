var mysql = require("mysql2");

// CONEXÃO DO BANCO MYSQL SERVER (valores vêm do arquivo .env / .env.dev)
var mySqlConfig = {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    decimalNumbers: true // devolve colunas DECIMAL como número (e não como texto)
};

// Executa uma instrução SQL e devolve uma Promise com o resultado.
// "valores" substitui cada "?" da instrução, na ordem, de forma segura
// (o mysql2 escapa os dados, o que evita SQL Injection).
// Ex.: executar("SELECT * FROM ambiente WHERE idAmbiente = ?", [5])
function executar(instrucao, valores) {
    return new Promise(function (resolve, reject) {
        var conexao = mysql.createConnection(mySqlConfig);
        conexao.connect();
        conexao.query(instrucao, valores || [], function (erro, resultados) {
            conexao.end();
            if (erro) {
                return reject(erro);
            }
            console.log(resultados);
            resolve(resultados);
        });
        conexao.on("error", function (erro) {
            console.log("ERRO NO MySQL SERVER: ", erro.sqlMessage);
        });
    });
}

module.exports = {
    executar
};
