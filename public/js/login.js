function entrar() {
    var emailVar = input_email.value;
    var senhaVar = input_senha.value;

    if (emailVar == "" || senhaVar == "") {
        mostrarMensagem("Preencha todos os campos!", "erro");
        return;
    }

    var corpo = { emailServer: emailVar, senhaServer: senhaVar };

    // POST: os dados vão no body, em JSON
    fetch("/usuarios/autenticar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpo)
    }).then(function (resposta) {
        registrarLog("POST", "/usuarios/autenticar", resposta.status, { emailServer: emailVar, senhaServer: "***" });

        if (resposta.ok) {
            resposta.json().then(function (json) {
                // Guardamos os dados do usuário na sessão do navegador
                sessionStorage.ID_USUARIO = json.id;
                sessionStorage.NOME_USUARIO = json.nome;
                sessionStorage.EMAIL_USUARIO = json.email;

                mostrarMensagem("Login realizado! Redirecionando...", "ok");
                setTimeout(function () {
                    window.location = "./ambientes.html";
                }, 800);
            });
        } else {
            resposta.text().then(function (texto) {
                mostrarMensagem(texto, "erro");
            });
        }
    }).catch(function (erro) {
        console.log(erro);
        mostrarMensagem("Não foi possível conectar à API.", "erro");
    });
}
