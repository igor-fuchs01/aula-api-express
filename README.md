# Aula API — Express + MySQL

Projeto didático para mostrar, na prática, como criar uma API do zero com **Node.js + Express + MySQL**, seguindo a mesma arquitetura do projeto de monitoramento (app.js → routes → controllers → models → banco), testar no **Postman** e exibir os dados em páginas **HTML** servidas pelo próprio Express.

Tema: monitoramento de temperatura e umidade de ambientes (estufa, câmara fria, sala de servidores).

## Como rodar

```bash
# 1. Banco: execute src/database/script-tabelas.sql no MySQL Workbench

# 2. Dependências
npm install

# 3. Configuração: copie .env.exemplo para .env.dev e coloque seu usuário/senha do MySQL

# 4. Servidor (com nodemon)
npm run dev
# -> http://localhost:3333   (login: professor@aula.com / 123456)

# 5. (opcional) Simulador de sensor, em outro terminal
npm run simular        # envia leituras para o ambiente 1
npm run simular -- 2   # para o ambiente 2
```

Postman: **Import** → `postman/aula-api.postman_collection.json`. A variável `baseUrl` já aponta para `http://localhost:3333`.

## Estrutura

```
aula-api-express/
├── app.js                  # 1. entrada: middlewares, rotas e app.listen
├── simulador.js            # faz o papel do Arduino (POST a cada 2s)
├── .env.exemplo            # modelo de configuração (porta, banco)
├── src/
│   ├── database/
│   │   ├── config.js       # conexão MySQL + função executar(sql, valores)
│   │   └── script-tabelas.sql
│   ├── routes/             # 2. URL + método HTTP -> função do controller
│   ├── controllers/        # 3. valida a requisição e escolhe o status
│   └── models/             # 4. SQL (única camada que fala com o banco)
├── public/                 # 5. front-end servido pelo express.static
│   ├── index.html          # login          (POST)
│   ├── cadastro.html       # cadastro       (POST)
│   ├── ambientes.html      # CRUD completo  (GET, POST, PUT, DELETE)
│   ├── dashboard.html      # tempo real     (GET a cada 2s + gráfico)
│   ├── css/style.css
│   └── js/
└── postman/aula-api.postman_collection.json
```

## Endpoints

| Método | Rota | Parâmetros | O que faz |
|---|---|---|---|
| POST | `/usuarios/cadastrar` | body: `nomeServer, emailServer, senhaServer` | Cria usuário (201) |
| POST | `/usuarios/autenticar` | body: `emailServer, senhaServer` | Login (200 / 403) |
| GET | `/ambientes/listar/:idUsuario` | params + query `?busca=` | Lista ambientes (200 / 204) |
| GET | `/ambientes/buscar/:idAmbiente` | params | Um ambiente (200 / 404) |
| POST | `/ambientes/cadastrar` | body | Cria ambiente (201 / 400) |
| PUT | `/ambientes/editar/:idAmbiente` | params + body | Atualiza (200 / 404) |
| DELETE | `/ambientes/deletar/:idAmbiente` | params | Remove (200 / 404) |
| GET | `/medidas/ultimas/:idAmbiente` | params + query `?limite=` | Últimas N leituras |
| GET | `/medidas/tempo-real/:idAmbiente` | params | Última leitura |
| GET | `/medidas/kpi/:idAmbiente` | params | Mín, máx e média do dia |
| POST | `/medidas/inserir/:idAmbiente` | params + body: `temperatura, umidade` | Grava leitura (201) |

## Conceitos

**Tipos de parâmetro**
- `req.params` → parte fixa da URL: `/ambientes/buscar/2`
- `req.query` → filtro opcional depois do `?`: `/ambientes/listar/1?busca=estufa`
- `req.body` → dados no corpo (JSON), usado em POST e PUT
- headers → metadados, ex.: `Content-Type: application/json`

**Status HTTP usados**
`200` OK · `201` criado · `204` sem conteúdo · `400` dados inválidos · `403` acesso negado · `404` não encontrado · `409` conflito · `500` erro no servidor

## Diferenças em relação ao projeto original

- Os models usam `?` com array de valores (`executar(sql, [valores])`) em vez de colocar as variáveis direto na string, o que evita SQL Injection.
- CRUD completo com PUT e DELETE, além do `affectedRows` para devolver 404.
- Uso de query string (`?busca=`, `?limite=`) para mostrar o terceiro tipo de parâmetro.
- Caixa "Requisições" em cada página mostra método, URL e status de cada `fetch`.
- Senhas em texto puro apenas por ser didático; em produção use hash (ex.: bcrypt).
