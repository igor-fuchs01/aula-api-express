DROP DATABASE IF EXISTS aula_api;
CREATE DATABASE aula_api;
USE aula_api;

-- Usuário do MySQL usado pela API (é o mesmo que está nos arquivos .env e .env.dev)
-- Assim ninguém precisa colocar a própria senha do MySQL no projeto.
CREATE USER IF NOT EXISTS 'aluno_api'@'localhost' IDENTIFIED BY 'Aluno@123';
GRANT ALL PRIVILEGES ON aula_api.* TO 'aluno_api'@'localhost';
FLUSH PRIVILEGES;

CREATE TABLE usuario (
    idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(80) NOT NULL,
    email VARCHAR(80) NOT NULL UNIQUE,
    senha VARCHAR(50) NOT NULL -- didático: em produção a senha deve ser criptografada (ex.: bcrypt)
);

-- Um ambiente monitorado (câmara, estufa, sala de servidores...)
CREATE TABLE ambiente (
    idAmbiente INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(80) NOT NULL,
    descricao VARCHAR(200),
    temperaturaMin DECIMAL(5,2),
    temperaturaMax DECIMAL(5,2),
    umidadeMin DECIMAL(5,2),
    umidadeMax DECIMAL(5,2),
    fkUsuario INT NOT NULL,
    FOREIGN KEY (fkUsuario) REFERENCES usuario(idUsuario)
);

-- Leituras do sensor (no projeto real chegam do Arduino; aqui pelo simulador ou pelo Postman)
CREATE TABLE medida (
    idMedida INT PRIMARY KEY AUTO_INCREMENT,
    temperatura DECIMAL(5,2) NOT NULL,
    umidade DECIMAL(5,2) NOT NULL,
    momento DATETIME DEFAULT CURRENT_TIMESTAMP,
    fkAmbiente INT NOT NULL,
    FOREIGN KEY (fkAmbiente) REFERENCES ambiente(idAmbiente) ON DELETE CASCADE
);

-- Dados de exemplo
INSERT INTO usuario (nome, email, senha) VALUES
    ('Professor Exemplo', 'professor@aula.com', '123456');

INSERT INTO ambiente (nome, descricao, temperaturaMin, temperaturaMax, umidadeMin, umidadeMax, fkUsuario) VALUES
    ('Estufa de Morangos', 'Estufa principal - setor A', 18, 26, 60, 80, 1),
    ('Câmara Fria', 'Armazenamento de laticínios', 2, 8, 80, 95, 1),
    ('Sala de Servidores', 'Datacenter do campus', 18, 24, 40, 60, 1);

INSERT INTO medida (temperatura, umidade, momento, fkAmbiente) VALUES
    (22.5, 70.1, NOW() - INTERVAL 6 MINUTE, 1),
    (23.0, 69.4, NOW() - INTERVAL 5 MINUTE, 1),
    (23.8, 68.2, NOW() - INTERVAL 4 MINUTE, 1),
    (24.6, 66.0, NOW() - INTERVAL 3 MINUTE, 1),
    (25.9, 63.5, NOW() - INTERVAL 2 MINUTE, 1),
    (26.7, 61.2, NOW() - INTERVAL 1 MINUTE, 1),
    (4.2, 88.0, NOW() - INTERVAL 2 MINUTE, 2),
    (5.1, 86.3, NOW() - INTERVAL 1 MINUTE, 2),
    (21.0, 48.0, NOW() - INTERVAL 1 MINUTE, 3);

SELECT * FROM medida;
