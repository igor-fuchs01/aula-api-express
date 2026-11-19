// O id do ambiente vem da URL da página: dashboard.html?idAmbiente=1
var parametrosUrl = new URLSearchParams(window.location.search);
var idAmbiente = parametrosUrl.get("idAmbiente") || 1;

var ambiente = {};
var grafico;
var LIMITE_PONTOS = 10;

function iniciarDashboard() {
    buscarAmbiente();
    buscarUltimasMedidas();
    buscarKpis();

    // Atualiza em "tempo real": uma nova requisição a cada 2 segundos
    setInterval(buscarMedidaEmTempoReal, 2000);
    setInterval(buscarKpis, 10000);
}

// GET /ambientes/buscar/:idAmbiente
function buscarAmbiente() {
    var url = `/ambientes/buscar/${idAmbiente}`;
    fetch(url)
        .then(function (resposta) {
            registrarLog("GET", url, resposta.status);
            return resposta.json();
        })
        .then(function (json) {
            ambiente = json;
            span_nome_ambiente.textContent = json.nome;
        });
}

// GET /medidas/ultimas/:idAmbiente?limite=10
function buscarUltimasMedidas() {
    var url = `/medidas/ultimas/${idAmbiente}?limite=${LIMITE_PONTOS}`;

    fetch(url)
        .then(function (resposta) {
            registrarLog("GET", url, resposta.status);
            if (resposta.status == 204) return [];
            return resposta.json();
        })
        .then(function (medidas) {
            montarGrafico(medidas);
            montarTabela(medidas);
        })
        .catch(function (erro) {
            console.log("Erro ao buscar últimas medidas:", erro);
        });
}

// GET /medidas/tempo-real/:idAmbiente
function buscarMedidaEmTempoReal() {
    var url = `/medidas/tempo-real/${idAmbiente}`;

    fetch(url)
        .then(function (resposta) {
            if (resposta.status == 204) return null;
            return resposta.json();
        })
        .then(function (medida) {
            if (medida == null) return;

            kpi_temp_agora.textContent = `${medida.temperatura} °C`;
            kpi_umid_agora.textContent = `${medida.umidade} %`;

            var fora = medida.temperatura < ambiente.temperaturaMin || medida.temperatura > ambiente.temperaturaMax;
            kpi_temp_agora.className = fora ? "alerta" : "";

            // Só adiciona no gráfico se for uma leitura nova
            if (grafico && grafico.data.labels[grafico.data.labels.length - 1] != medida.momento_grafico) {
                registrarLog("GET", url, 200);
                grafico.data.labels.push(medida.momento_grafico);
                grafico.data.datasets[0].data.push(medida.temperatura);
                grafico.data.datasets[1].data.push(medida.umidade);

                if (grafico.data.labels.length > LIMITE_PONTOS) {
                    grafico.data.labels.shift();
                    grafico.data.datasets[0].data.shift();
                    grafico.data.datasets[1].data.shift();
                }
                grafico.update();
                adicionarLinhaTabela(medida);
            }
        });
}

// GET /medidas/kpi/:idAmbiente
function buscarKpis() {
    var url = `/medidas/kpi/${idAmbiente}`;
    fetch(url)
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (kpi) {
            if (kpi.totalLeituras == 0) {
                kpi_media.textContent = "--";
                kpi_min_max.textContent = "--";
                return;
            }
            kpi_media.textContent = `${kpi.temperaturaMedia} °C`;
            kpi_min_max.textContent = `${kpi.temperaturaMin} / ${kpi.temperaturaMax}`;
        });
}

function montarGrafico(medidas) {
    var labels = medidas.map(function (m) { return m.momento_grafico; });
    var temperaturas = medidas.map(function (m) { return m.temperatura; });
    var umidades = medidas.map(function (m) { return m.umidade; });

    // Se o Chart.js (CDN) não carregar, a tabela continua funcionando
    if (typeof Chart == "undefined") return;

    grafico = new Chart(document.getElementById("grafico"), {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                { label: "Temperatura (°C)", data: temperaturas, borderColor: "#ffbe55", backgroundColor: "#ffbe55", tension: 0.3 },
                { label: "Umidade (%)", data: umidades, borderColor: "#575757", backgroundColor: "#575757", tension: 0.3 }
            ]
        }
    });
}

function montarTabela(medidas) {
    tbody_medidas.innerHTML = "";
    medidas.forEach(adicionarLinhaTabela);
}

function adicionarLinhaTabela(m) {
    // insere a mais recente no topo
    tbody_medidas.innerHTML = `<tr><td>${m.momento_grafico}</td><td>${m.temperatura}</td><td>${m.umidade}</td></tr>` + tbody_medidas.innerHTML;
    while (tbody_medidas.rows.length > LIMITE_PONTOS) {
        tbody_medidas.deleteRow(tbody_medidas.rows.length - 1);
    }
}
