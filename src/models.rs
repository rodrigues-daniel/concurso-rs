// concursos-api/src/models.rs

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Banca {
    pub id: i64,
    pub nome: String,
    pub descricao: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Concurso {
    pub id: i64,
    pub nome: String,
    pub orgao: Option<String>,
    pub ano: Option<i32>,
    pub banca_id: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Assunto {
    pub id: i64,
    pub nome: String,
    pub descricao: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Questao {
    pub id: i64,
    pub enunciado: String,
    pub alternativa_a: Option<String>,
    pub alternativa_b: Option<String>,
    pub alternativa_c: Option<String>,
    pub alternativa_d: Option<String>,
    pub alternativa_e: Option<String>,
    pub alternativa_correta: String,
    pub assunto_id: Option<i64>,
    pub concurso_id: Option<i64>,
}

// ── DTOs de request ──────────────────────────────────────

#[derive(Debug, Deserialize)]
pub struct ValidarRespostaRequest {
    pub resposta: String,
}

#[derive(Debug, Serialize)]
pub struct ValidarRespostaResponse {
    pub correta: bool,
    pub alternativa_correta: String,
}
