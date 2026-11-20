// Se rodarmos com "npm run dev", o nodemon define NODE_ENV=dev e usamos o .env.dev
// Sintaxe do operador ternário: condição ? valor_se_verdadeiro : valor_se_falso
var caminho_env = process.env.NODE_ENV === "dev" ? ".env.dev" : ".env";
require("dotenv").config({ path: caminho_env });

var express = require("express");
var cors = require("cors");
var path = require("path");

var PORTA_APP = process.env.APP_PORT || 3333;
var HOST_APP = process.env.APP_HOST || "localhost";

var app = express();

var usuarioRouter = require("./src/routes/usuarios");
var ambienteRouter = require("./src/routes/ambientes");
var medidaRouter = require("./src/routes/medidas");
var testeRouter = require("./src/routes/teste");

app.use(express.json());                          // lê o corpo (body) em JSON -> req.body
app.use(express.urlencoded({ extended: false })); // lê o corpo de formulários HTML
app.use(express.static(path.join(__dirname, "public"))); // serve os arquivos HTML/CSS/JS da pasta public
app.use(cors());                                  // permite chamadas vindas de outras origens

app.use("/usuarios", usuarioRouter);
app.use("/ambientes", ambienteRouter);
app.use("/medidas", medidaRouter);
app.use("/teste", testeRouter);

// Qualquer rota que não existir cai aqui (404 = não encontrado)
app.use(function (req, res) {
    res.status(404).json({ mensagem: `Rota ${req.method} ${req.originalUrl} não existe` });
});

app.listen(PORTA_APP, function () {
    console.log(`
    =====================================================
      Servidor rodando! Acesse: http://${HOST_APP}:${PORTA_APP}
      Ambiente: ${process.env.AMBIENTE_PROCESSO}
      Teste a API no Postman importando a pasta /postman
    =====================================================
    `);
});
