-- Add migration script here
-- concursos-api/migrations/001_create_schema.sql
-- ALTERAÇÃO: alternativas removidas, tipo_questao adicionado

CREATE TABLE IF NOT EXISTS bancas (
    id        BIGSERIAL    PRIMARY KEY,
    nome      VARCHAR(255) NOT NULL UNIQUE,
    descricao TEXT
);

CREATE TABLE IF NOT EXISTS concursos (
    id       BIGSERIAL    PRIMARY KEY,
    nome     VARCHAR(255) NOT NULL,
    orgao    VARCHAR(255),
    ano      INTEGER,
    banca_id BIGINT REFERENCES bancas(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS assuntos (
    id        BIGSERIAL    PRIMARY KEY,
    nome      VARCHAR(255) NOT NULL UNIQUE,
    descricao TEXT
);

CREATE TABLE IF NOT EXISTS questoes (
    id                  BIGSERIAL    PRIMARY KEY,
    enunciado           TEXT         NOT NULL,
    gabarito            BOOLEAN      NOT NULL,
    justificativa       TEXT,
    assunto_id          BIGINT REFERENCES assuntos(id)  ON DELETE SET NULL,
    concurso_id         BIGINT REFERENCES concursos(id) ON DELETE CASCADE
);