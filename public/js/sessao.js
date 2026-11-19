// Funções compartilhadas entre as páginas

// Redireciona para o login se não houver usuário na sessão
function validarSessao() {
    var id = sessionStorage.ID_USUARIO;
    var nome = sessionStorage.NOME_USUARIO;

    if (id == undefined || nome == undefined) {
        window.location = "./index.html";
        return;
    }

    var spanNome = document.getElementById("nome_usuario");
    if (spanNome) {
        spanNome.textContent = nome;
    }
}

function limparSessao() {
    sessionStorage.clear();
    window.location = "./index.html";
}

// Mostra na tela qual requisição foi feita (método, URL, status).
// Ajuda os alunos a enxergar o que acontece "por baixo" do fetch.
function registrarLog(metodo, url, status, corpo) {
    var caixa = document.getElementById("div_log");
    if (!caixa) return;

    var linha = `${new Date().toLocaleTimeString()}  ${metodo} ${url}  ->  ${status}`;
    if (corpo) {
        linha += `\n   body: ${JSON.stringify(corpo)}`;
    }
    caixa.textContent = linha + "\n" + caixa.textContent;
}

function mostrarMensagem(texto, tipo) {
    var div = document.getElementById("div_mensagem");
    div.textContent = texto;
    div.className = "mensagem " + (tipo || "");
}
