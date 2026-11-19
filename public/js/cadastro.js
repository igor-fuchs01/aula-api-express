function cadastrar() {
    var nomeVar = input_nome.value;
    var emailVar = input_email.value;
    var senhaVar = input_senha.value;

    if (nomeVar == "" || emailVar == "" || senhaVar == "") {
        mostrarMensagem("Preencha todos os campos!", "erro");
        return;
    }
    if (!emailVar.includes("@")) {
        mostrarMensagem("E-mail inválido!", "erro");
        return;
    }

    fetch("/usuarios/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nomeServer: nomeVar,
            emailServer: emailVar,
            senhaServer: senhaVar
        })
    }).then(function (resposta) {
        registrarLog("POST", "/usuarios/cadastrar", resposta.status, { nomeServer: nomeVar, emailServer: emailVar });

        if (resposta.ok) {
            mostrarMensagem("Cadastro realizado! Redirecionando para o login...", "ok");
            setTimeout(function () {
                window.location = "./index.html";
            }, 1200);
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
