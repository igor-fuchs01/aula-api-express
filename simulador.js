// ============================================================
// SIMULADOR DE SENSOR (faz o papel do Arduino)
// Envia uma leitura a cada 2 segundos com POST /medidas/inserir/:idAmbiente
// Uso: npm run simular            (ambiente 1)
//      npm run simular -- 2       (ambiente 2)
// O servidor precisa estar rodando (npm run dev) em outro terminal.
// ============================================================

require("dotenv").config({ path: ".env.dev" }); // lê APP_PORT, se existir

var idAmbiente = process.argv[2] || 1;
var URL_API = `http://localhost:${process.env.APP_PORT || 3333}/medidas/inserir/${idAmbiente}`;

var temperatura = 22;
var umidade = 70;

function variar(valor, passo, min, max) {
    var novo = valor + (Math.random() * 2 - 1) * passo;
    return Math.min(max, Math.max(min, Number(novo.toFixed(1))));
}

function enviarLeitura() {
    temperatura = variar(temperatura, 0.8, -5, 40);
    umidade = variar(umidade, 1.5, 20, 99);

    var corpo = { temperatura: temperatura, umidade: umidade };

    fetch(URL_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpo)
    })
        .then(function (resposta) {
            console.log(`POST ${URL_API} -> ${resposta.status}  ${JSON.stringify(corpo)}`);
        })
        .catch(function (erro) {
            console.log("API fora do ar? Rode 'npm run dev' em outro terminal.", erro.message);
        });
}

console.log(`Simulando sensor do ambiente ${idAmbiente}... (Ctrl + C para parar)`);
enviarLeitura();
setInterval(enviarLeitura, 2000);
