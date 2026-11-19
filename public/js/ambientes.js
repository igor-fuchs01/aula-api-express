// ============================================================
// CRUD completo de ambientes consumindo a API com fetch
// GET (listar/buscar) · POST (cadastrar) · PUT (editar) · DELETE (deletar)
// ============================================================

// ---------- GET com params + query ----------
function listarAmbientes() {
    var idUsuario = sessionStorage.ID_USUARIO;
    var busca = input_busca.value;

    var url = `/ambientes/listar/${idUsuario}`;          // params
    if (busca != "") {
        url += `?busca=${encodeURIComponent(busca)}`;    // query
    }

    fetch(url)
        .then(function (resposta) {
            registrarLog("GET", url, resposta.status);

            if (resposta.status == 204) {
                return []; // 204 não tem corpo: lista vazia
            }
            if (!resposta.ok) {
                throw new Error("Erro ao listar ambientes");
            }
            return resposta.json();
        })
        .then(function (ambientes) {
            mostrarAmbientes(ambientes);
        })
        .catch(function (erro) {
            console.log(erro);
            div_ambientes.innerHTML = `<p class="alerta">Não foi possível carregar os ambientes.</p>`;
        });
}

function mostrarAmbientes(ambientes) {
    if (ambientes.length == 0) {
        div_ambientes.innerHTML = `<p>Nenhum ambiente encontrado.</p>`;
        return;
    }

    var html = "";
    ambientes.forEach(function (a) {
        var temp = a.ultimaTemperatura == null ? "--" : `${a.ultimaTemperatura} °C`;
        var umid = a.ultimaUmidade == null ? "--" : `${a.ultimaUmidade} %`;
        var foraDaFaixa = a.ultimaTemperatura != null &&
            (a.ultimaTemperatura < a.temperaturaMin || a.ultimaTemperatura > a.temperaturaMax);

        html += `
            <div class="ambiente">
                <h3>${a.nome}</h3>
                <p>${a.descricao || ""}</p>
                <p>Faixa ideal: ${a.temperaturaMin}–${a.temperaturaMax} °C · ${a.umidadeMin}–${a.umidadeMax} %</p>
                <div class="valores ${foraDaFaixa ? "alerta" : ""}">${temp} · ${umid}</div>
                <button class="pequeno" onclick="window.location='./dashboard.html?idAmbiente=${a.idAmbiente}'">Dashboard</button>
                <button class="pequeno secundario" onclick="carregarParaEdicao(${a.idAmbiente})">Editar</button>
                <button class="pequeno perigo" onclick="deletarAmbiente(${a.idAmbiente})">Excluir</button>
            </div>
        `;
    });
    div_ambientes.innerHTML = html;
}

// ---------- GET de um item (params) para preencher o formulário ----------
function carregarParaEdicao(idAmbiente) {
    var url = `/ambientes/buscar/${idAmbiente}`;

    fetch(url)
        .then(function (resposta) {
            registrarLog("GET", url, resposta.status);
            return resposta.json();
        })
        .then(function (a) {
            input_id.value = a.idAmbiente;
            input_nome.value = a.nome;
            input_descricao.value = a.descricao || "";
            input_temp_min.value = a.temperaturaMin;
            input_temp_max.value = a.temperaturaMax;
            input_umid_min.value = a.umidadeMin;
            input_umid_max.value = a.umidadeMax;
            h2_formulario.textContent = `Editando: ${a.nome}`;
            input_nome.focus();
        });
}

// ---------- POST (novo) ou PUT (edição) com body ----------
function salvarAmbiente() {
    var corpo = {
        nome: input_nome.value,
        descricao: input_descricao.value,
        temperaturaMin: Number(input_temp_min.value),
        temperaturaMax: Number(input_temp_max.value),
        umidadeMin: Number(input_umid_min.value),
        umidadeMax: Number(input_umid_max.value),
        fkUsuario: Number(sessionStorage.ID_USUARIO)
    };

    var editando = input_id.value != "";
    var metodo = editando ? "PUT" : "POST";
    var url = editando ? `/ambientes/editar/${input_id.value}` : "/ambientes/cadastrar";

    fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpo)
    }).then(function (resposta) {
        registrarLog(metodo, url, resposta.status, corpo);

        if (resposta.ok) {
            mostrarMensagem(editando ? "Ambiente atualizado!" : "Ambiente cadastrado!", "ok");
            limparFormulario(true);
            listarAmbientes();
        } else {
            // A API devolve a mensagem de validação (status 400)
            resposta.text().then(function (texto) {
                mostrarMensagem(texto, "erro");
            });
        }
    }).catch(function () {
        mostrarMensagem("Não foi possível conectar à API.", "erro");
    });
}

// ---------- DELETE com params ----------
function deletarAmbiente(idAmbiente) {
    if (!confirm("Excluir este ambiente e todas as suas medidas?")) {
        return;
    }

    var url = `/ambientes/deletar/${idAmbiente}`;

    fetch(url, { method: "DELETE" })
        .then(function (resposta) {
            registrarLog("DELETE", url, resposta.status);
            if (resposta.ok) {
                listarAmbientes();
            } else {
                resposta.text().then(function (texto) {
                    alert(texto);
                });
            }
        });
}

function limparFormulario(manterMensagem) {
    input_id.value = "";
    input_nome.value = "";
    input_descricao.value = "";
    input_temp_min.value = "";
    input_temp_max.value = "";
    input_umid_min.value = "";
    input_umid_max.value = "";
    h2_formulario.textContent = "Novo ambiente";
    if (!manterMensagem) {
        mostrarMensagem("");
    }
}
