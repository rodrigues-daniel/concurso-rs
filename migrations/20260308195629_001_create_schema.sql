-- Add migration script here
-- concursos-api/migrations/001_create_schema.sql

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
    id                  BIGSERIAL  PRIMARY KEY,
    enunciado           TEXT       NOT NULL,
    alternativa_a       TEXT,
    alternativa_b       TEXT,
    alternativa_c       TEXT,
    alternativa_d       TEXT,
    alternativa_e       TEXT,
    alternativa_correta VARCHAR(1) NOT NULL,
    assunto_id          BIGINT REFERENCES assuntos(id)  ON DELETE SET NULL,
    concurso_id         BIGINT REFERENCES concursos(id) ON DELETE CASCADE
);